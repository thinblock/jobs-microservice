import { InternalServerError } from 'restify-errors';
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

  public async getAll(req: IRequest, res: IResponse) {
    const userId: string = req.client_id;
    try {
      const jobs = await Job.find({ client_id: userId });
      return res.send(jobs);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
