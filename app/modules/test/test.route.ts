import ActionsController from './test.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class ActionsRoute implements IRoute {
  public basePath = '/actions';
  public controller = new ActionsController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
      }
    ];
  }
}

export default ActionsRoute;
