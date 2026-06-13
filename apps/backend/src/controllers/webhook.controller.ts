import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { WhatsAppService } from '../services/whatsapp.service';

export const handleWhatsAppWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    
    if (body.event === 'message' && body.data && body.data.message) {
      const incomingMessage = body.data.message.body;
      const from = body.data.message.from;
      
      if (body.data.message.fromMe) {
        return res.status(200).send('EVENT_RECEIVED');
      }

      console.log(`Received WhatsApp message from ${from}: ${incomingMessage}`);

      const { intent, entities } = await AIService.analyzeIntent(incomingMessage);
      
      // Process DB logic and generate final reply
      const { text, pdfUrl } = await AIService.processActionAndGenerateResponse(intent, entities, from);
      
      // Send text
      await WhatsAppService.sendMessage(from, text);

      // Send PDF if generated
      if (pdfUrl) {
        await WhatsAppService.sendQuotationPdf(from, pdfUrl);
      }
    }

    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('SERVER_ERROR');
  }
};
