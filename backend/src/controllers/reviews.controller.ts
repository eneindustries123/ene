import { Request, Response } from 'express';
import { ReviewsService } from '../services/reviews.service';
import { submitReviewSchema, updateReviewStatusSchema } from '../validators/review.validator';

export class ReviewsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status } = req.query;
      if (status === 'approved') {
        const reviews = await ReviewsService.getApprovedFeaturedReviews();
        return res.status(200).json(reviews);
      }
      const reviews = await ReviewsService.getAllReviews();
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
    }
  }

  static async getApproved(req: Request, res: Response) {
    try {
      const reviews = await ReviewsService.getApprovedFeaturedReviews();
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
    }
  }

  static async submit(req: Request, res: Response) {
    try {
      const parsedData = submitReviewSchema.parse(req.body);
      const result = await ReviewsService.submitPublicReview(parsedData);
      return res.status(201).json(result);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to submit review' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, featured } = updateReviewStatusSchema.parse(req.body);

      const updated = await ReviewsService.updateReviewStatus(id, status, featured);
      if (!updated) {
        return res.status(404).json({ error: 'Review not found' });
      }

      return res.status(200).json(updated);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to update review status' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await ReviewsService.deleteReview(id);
      return res.status(200).json({ success, message: 'Review permanently deleted' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to delete review' });
    }
  }
}
