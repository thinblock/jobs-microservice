import { Schema, model, Document } from 'mongoose';

const ParamsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  required: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['number', 'string', 'boolean']
  }
});

const ActionsSchema = new Schema({
  event_name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  params_schema: [ParamsSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'actions' });

export default model<IAction>('actions', ActionsSchema);

interface IActionParams {
  _id: Schema.Types.ObjectId;
  required: boolean;
  name: string;
  type: string;
}

export interface IAction extends Document {
  event_name: string;
  description: string;
  params_schema: [IActionParams];
  created_at?: Date;
  updated_at?: Date;
}