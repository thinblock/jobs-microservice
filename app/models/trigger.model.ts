import { Schema, model, Document } from 'mongoose';

const TriggersSchema = new Schema({
  event_name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'triggers' });

export default model<ITrigger>('triggers', TriggersSchema);

export interface ITrigger extends Document {
  _id: Schema.Types.ObjectId;
  event_name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}