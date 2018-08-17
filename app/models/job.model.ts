import { Schema, model, Document } from 'mongoose';
import { v1 } from 'node-uuid';

const ActionsSchema = new Schema({
  action: {
    type: Schema.Types.ObjectId,
    ref: 'actions',
    required: true
  },
  params: {}
});

const ConditionsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  when: {
    type: String,
    required: true
  },
  operation: {
    type: String,
    required: true
  },
  argument: {
    type: {
      type: String,
      required: true,
      enum: ['boolean', 'string', 'number']
    },
    value: String
  }
});

const JobsSchema = new Schema({
  token: {
    type: String,
    default: v1(),
    unique: true,
    required: true
  },
  client_id: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  trigger: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'triggers',
      required: true
    },
    conditions: [ConditionsSchema]
  },
  actions: [ActionsSchema],
  last_run: {
    date: { type: Date },
    output: {}
  },
  stats: {
    failed_count: {
      type: Number,
      default: 0
    },
    success_count: {
      type: Number,
      default: 0
    },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'jobs' });

export default model<IJob>('jobs', JobsSchema);

interface IJobCondition {
  _id?: Schema.Types.ObjectId;
  when: string;
  operation: string;
  argument: {
    type: string;
    value: string;
  };
}

interface IJobActions {
  action: Schema.Types.ObjectId;
  params: any;
}

export interface IJob extends Document {
  token: string;
  active: boolean;
  client_id: string;
  trigger: {
    id: Schema.Types.ObjectId;
    conditions: [IJobCondition]
  };
  actions: [IJobActions];
  last_run: {
    date: Date;
    output: any;
  };
  stats: {
    failed_count: number;
    success_count: number;
  };
  created_at?: Date;
  updated_at?: Date;
}
