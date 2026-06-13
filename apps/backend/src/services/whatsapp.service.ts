import dotenv from 'dotenv';

dotenv.config();

export class WhatsAppService {
  public static async sendMessage(to: string, message: string): Promise<void> {
    const instanceId = process.env.WAAPI_INSTANCE_ID;
    const token = process.env.WAAPI_TOKEN;

    if (!instanceId || !token || token === 'ADD_YOUR_API_TOKEN_HERE') {
      console.warn(`[WhatsApp API] Mock sending to ${to}: ${message} (WaAPI Token missing)`);
      return;
    }

    try {
      const response = await fetch(`https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: to.includes('@c.us') ? to : `${to}@c.us`,
          message: message
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[WhatsApp API] Failed to send message via WaAPI:', data);
      } else {
        console.log(`[WhatsApp API] Successfully sent message to ${to}`);
      }
    } catch (error) {
      console.error('[WhatsApp API] Error making request to WaAPI:', error);
    }
  }

  public static async sendQuotationPdf(to: string, pdfUrl: string): Promise<void> {
    console.log(`[WhatsApp API] PDF generation and sending is mocked for now: ${pdfUrl} to ${to}`);
  }
}
