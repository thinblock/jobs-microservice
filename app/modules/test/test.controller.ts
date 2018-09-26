import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';

export default class AppsController implements IController {
  public async post(req: IRequest, res: IResponse) {
    console.log(req.body);
    return res.send('ok');
  }
}
