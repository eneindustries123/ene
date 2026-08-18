import { Request, Response } from 'express';
import { EnquiriesService } from '../services/enquiries.service';
import { contactEnquirySchema } from '../validators/enquiry.validator';

export class EnquiriesController {
  static async submit(req: Request, res: Response) {
    try {
      const parsedData = contactEnquirySchema.parse(req.body);
      const result = await EnquiriesService.submitEnquiry(parsedData);
      return res.status(201).json(result);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to submit enquiry' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const enquiries = await EnquiriesService.getAllEnquiries();
      return res.status(200).json(enquiries);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch enquiries' });
    }
  }
}
