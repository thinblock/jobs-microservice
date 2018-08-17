import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import Trigger from '../../models/trigger.model';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';

export default class TriggersController implements IController {
  public async post(req: IRequest, res: IResponse) {
    try {
      const trigger = new Trigger(req.body);
      await trigger.save();
      return res.send(trigger);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }

  public async getAll(req: IRequest, res: IResponse) {
    try {
      const triggers = await Trigger.find();
      return res.send(triggers);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
