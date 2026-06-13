import Tesseract from 'tesseract.js';

export class OCRService {
  public static async extractTextFromImage(imagePath: string): Promise<string> {
    try {
      console.log(`Starting OCR processing for image: ${imagePath}`);
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
        logger: m => console.log(`OCR Progress: ${m.status} - ${(m.progress * 100).toFixed(2)}%`)
      });
      console.log(`OCR processing complete.`);
      return text;
    } catch (error) {
      console.error('Error during OCR processing:', error);
      throw new Error('Failed to extract text from image');
    }
  }
}
