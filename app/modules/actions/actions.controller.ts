import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import Action from '../../models/action.model';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse) {
    try {
      const action = new Action(req.body);
      const obj = await action.save();
      return res.send(action);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }

  public async getAll(req: IRequest, res: IResponse) {
    const userId: string = req.client_id;
    try {
      const actions = await Action.find();
      return res.send(actions);
    } catch (e) {
      req.log.error(e);
      throw new InternalServerError(e);
    }
  }
}
