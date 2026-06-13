import { Request, Response } from 'express';
import { OCRService } from '../services/ocr.service';
import Groq from 'groq-sdk';
import { prisma } from '../utils/prisma';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const processOCR = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const text = await OCRService.extractTextFromImage(req.file.path);
    
    // Use Groq to structure the raw OCR text into JSON
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Extract supplier invoice details from this OCR text and return a JSON object with: { supplierName, totalAmount, items: [{ name, quantity, price }] }" },
        { role: "user", content: text }
      ],
      model: "llama3-8b-8192",
      temperature: 0.1,
    });

    const structuredData = completion.choices[0]?.message?.content || '{}';
    res.status(200).json({ rawText: text, parsedData: JSON.parse(structuredData) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const businessAnalytics = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    // In a real scenario, we'd query the DB and pass the context. 
    // For MVP, we will pass some aggregate data to the AI to answer the owner's question.
    const totalOrders = await prisma.order.count();
    const products = await prisma.product.count();
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `You are the BizPilot AI business advisor. Answer the owner's question based on the following metrics: Total Orders: ${totalOrders}, Total Products: ${products}.` },
        { role: "user", content: question }
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
    });

    res.status(200).json({ answer: completion.choices[0]?.message?.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const voiceCommand = async (req: Request, res: Response) => {
  try {
    // Note: In production we'd use groq.audio.transcriptions, but using a mocked text-based alternative for the MVP if audio is sent as base64 string
    const { transcriptionText } = req.body; 
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are the AI business engine. The owner spoke a command. Return a JSON describing the action to take. e.g. { action: 'UPDATE_PRICE', product: 'printer', percentage: 5 }" },
        { role: "user", content: transcriptionText }
      ],
      model: "llama3-8b-8192",
      temperature: 0.1,
    });

    res.status(200).json({ result: JSON.parse(completion.choices[0]?.message?.content || '{}') });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
