import { InternalServerError, NotFoundError, BadRequestError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import Job from '../../models/job.model';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { publishJobCreated } from '../../../utils/helpers';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse) {
    const userId: string = req.client_id;
    try {
      const job = new Job({
        ...req.body,
        client_id: userId,
        stats: {
          failed_count: 0,
          success_count: 0
        }
      });

      await job.save();
      publishJobCreated(job._id);

      return res.send(job);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }

  public async put(req: IRequest, res: IResponse) {
    const jobId: string = req.params.job_id;
    const payload: any = req.body;
    try {
      await Job.findByIdAndUpdate(jobId, req.body).exec();
      return res.send({ success: true, message: 'Job updated successfully' });
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }

  public async getAll(req: IRequest, res: IResponse) {
    const userId: string = req.client_id;
    const trigger: string = req.query.trigger;
    try {
      const pipeline = [];

      pipeline.push({
        $match: {
          active: true
        }
      });
      pipeline.push({
        $lookup: {
          from: 'triggers',
          localField: 'trigger.id',
          foreignField: '_id',
          as: 'trigger.data'
        }
      });
      pipeline.push({
        $unwind: '$actions'
      });
      pipeline.push({
        $unwind: '$actions.action'
      });
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: 'actions.action',
          foreignField: '_id',
          as: 'actions.action'
        }
      });
      pipeline.push({
        $unwind: '$trigger.data'
      });
      pipeline.push({
        $group: {
          _id: '$_id',
          token: {
            $first: '$token'
          },
          notification: {
            $first: '$notification'
          },
          last_run: {
            $first: '$last_run'
          },
          'trigger': {
            $first: '$trigger'
          },
          actions: {
            $push: '$actions'
          }
        }
      });

      pipeline.push({
        $project: {
          _id: 1,
          token: 1,
          notification: 1,
          last_run: 1,
          'actions.action.event_name': 1,
          'actions.action.sns_topic_arn': 1,
          'actions._id': 1,
          'actions.params': 1,
          'trigger.data.event_name': 1,
          'trigger.conditions': 1
        }
      });

      if (trigger) {
        pipeline.push({
          $match: {
            'trigger.data.event_name': trigger
          }
        });
      }
      const jobs = await Job.aggregate(pipeline);
      return res.send(jobs);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }

  public async get(req: IRequest, res: IResponse) {
    const jobId: string = req.params.jobId;
    const lookBy: string = req.query.look_up;

    try {
      const job = await Job.findOne({ [lookBy]: jobId })
        .populate('actions.action', 'event_name params_schema description _id')
        .populate('trigger.id', 'event_name description _id');

      if (!job) {
        return res.send(new NotFoundError('Job not found'));
      }

      return res.send(job);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
