import { InternalServerError } from 'restify-errors';
import to from 'await-to-js';
import IController from '../../interfaces/utils/IController';
import Action, { IAction } from '../../models/action.model';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { createTopic } from '../../../utils/helpers';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse) {
    try {
      const action = new Action(req.body);
      // Save the action and create a aws sns topic in parallel
      const [obj, topicArn] = <[IAction, string]> await Promise.all([
        action.save(),
        createTopic(req.body.event_name)
      ]);

      obj.sns_topic_arn = topicArn;
      const [err] = await to(obj.save());

      if (err) {
        await obj.remove();
        req.log.error(err);
        return res.send(new InternalServerError(err));
      }

      return res.send(obj.toJSON());
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
  }

  public async getAll(req: IRequest, res: IResponse) {
    try {
      const actions = await Action.find();
      return res.send(actions);
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError(e));
    }
  }
}
