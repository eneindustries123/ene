import { Request, Response } from 'express';
import { QuotesService } from '../services/quotes.service';
import { quoteRequestSchema } from '../validators/quote.validator';

export class QuotesController {
  static async submit(req: Request, res: Response) {
    try {
      const parsedData = quoteRequestSchema.parse(req.body);
      const result = await QuotesService.submitQuoteRequest(parsedData);
      return res.status(201).json(result);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to submit quote request' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const quotes = await QuotesService.getAllQuotes();
      return res.status(200).json(quotes);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch quote requests' });
    }
  }
}
