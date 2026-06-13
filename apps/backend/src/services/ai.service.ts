import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { prisma } from '../utils/prisma';
import { PDFService } from './pdf.service';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export class AIService {
  public static async analyzeIntent(message: string): Promise<{ intent: string, entities: any }> {
    console.log(`Analyzing message via Groq API: "${message}"`);
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for BizPilot AI. Your goal is to analyze customer messages and return ONLY a raw JSON object. Do not include markdown formatting or backticks.
The JSON must have the following structure:
{
  "intent": "REQUEST_QUOTATION" | "CREATE_ORDER" | "GENERAL_SUPPORT",
  "entities": {
    "product": string | null,
    "quantity": number | null
  }
}`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      
      try {
        const parsed = JSON.parse(responseText.trim());
        return {
          intent: parsed.intent || 'GENERAL_SUPPORT',
          entities: parsed.entities || {}
        };
      } catch (err) {
        console.error("Failed to parse Groq response JSON:", responseText);
        return { intent: 'GENERAL_SUPPORT', entities: {} };
      }

    } catch (error) {
      console.error("Groq API Error in analyzeIntent:", error);
      return { intent: 'GENERAL_SUPPORT', entities: {} };
    }
  }

  public static async processActionAndGenerateResponse(intent: string, entities: any, customerPhone: string): Promise<{text: string, pdfUrl?: string}> {
    try {
      // Get the first business (since this is an MVP)
      const business = await prisma.business.findFirst();
      if (!business) {
        return { text: "System is not fully configured yet. Business record missing." };
      }

      let contextData: any = {};
      let pdfUrl: string | undefined;

      // Ensure customer exists
      let customer = await prisma.customer.findFirst({
        where: { whatsappNumber: customerPhone, businessId: business.id }
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            businessId: business.id,
            name: "WhatsApp User",
            whatsappNumber: customerPhone
          }
        });
      }

      if (intent === 'REQUEST_QUOTATION' || intent === 'CREATE_ORDER') {
        const searchProduct = entities.product || '';
        
        // Find product in DB
        const products = await prisma.product.findMany({
          where: {
            businessId: business.id,
            name: { contains: searchProduct, mode: 'insensitive' }
          },
          take: 1
        });

        if (products.length > 0) {
          const product = products[0];
          const qty = entities.quantity || 1;
          contextData = {
            productFound: true,
            productName: product.name,
            price: product.sellingPrice,
            stock: product.stockQuantity,
            requestedQty: qty
          };

          if (intent === 'CREATE_ORDER') {
            if (product.stockQuantity >= qty) {
              // Create Order
              const order = await prisma.order.create({
                data: {
                  businessId: business.id,
                  customerId: customer.id,
                  status: 'NEW',
                  totalAmount: product.sellingPrice * qty,
                  items: {
                    create: [{
                      productId: product.id,
                      quantity: qty,
                      price: product.sellingPrice
                    }]
                  }
                }
              });

              // Reduce stock
              await prisma.product.update({
                where: { id: product.id },
                data: { stockQuantity: { decrement: qty } }
              });

              contextData.orderCreated = true;
              contextData.orderId = order.id;
            } else {
              contextData.orderCreated = false;
              contextData.error = "Out of stock";
            }
          } else if (intent === 'REQUEST_QUOTATION') {
            // Generate PDF
            const quotationPath = await PDFService.generateQuotation(customerPhone, [{
              name: product.name,
              quantity: qty,
              price: product.sellingPrice
            }]);
            
            pdfUrl = `http://localhost:4000${quotationPath}`; // Hardcoded for local testing
          }
        } else {
          contextData = { productFound: false, searchedFor: searchProduct };
        }
      }

      // Generate conversational reply
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are the customer service representative for BizPilot AI. Generate a professional and concise response to the customer based on their intent and the database context provided."
          },
          {
            role: "user",
            content: `Intent: ${intent}\nContext: ${JSON.stringify(contextData)}`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content || "Hello! How can BizPilot assist your business today?";
      return { text, pdfUrl };

    } catch (error) {
      console.error("Error in processActionAndGenerateResponse:", error);
      return { text: "Sorry, I am having trouble connecting to the database." };
    }
  }
}
