import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICreditHistory {
  amount: number;
  reason: string;
  earnedAt: Date;
}

export interface ICloudCredit extends Document {
  userId: Types.ObjectId;
  total: number;
  history: ICreditHistory[];
}

const CreditHistorySchema = new Schema<ICreditHistory>(
  {
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CloudCreditSchema = new Schema<ICloudCredit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    total: { type: Number, default: 0, min: 0 },
    history: [CreditHistorySchema],
  },
  { timestamps: true }
);

CloudCreditSchema.index({ userId: 1 });

const CloudCredit: Model<ICloudCredit> =
  mongoose.models.CloudCredit ||
  mongoose.model<ICloudCredit>('CloudCredit', CloudCreditSchema);

export default CloudCredit;
