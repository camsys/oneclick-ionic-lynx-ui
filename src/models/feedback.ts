export class FeedbackModel {
  feedbackable_type: string;
  feedbackable_id: number;
  rating: number;
  review: string;
  email: string;
  phone: string;
  acknowledged: Boolean;
  acknowledged_at: string;
  acknowledgement_comment: string;
  acknowledged_by: string;
  subject: string;
  created_at: string;
}
