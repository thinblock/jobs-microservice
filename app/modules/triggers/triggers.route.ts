import TriggersController from './triggers.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class JobsRoute implements IRoute {
  public basePath = '/triggers';
  public controller = new TriggersController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.getAll,
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              event_name: Joi.string().required(),
              description: Joi.string().required()
            }).required()
          }
        },
      }
    ];
  }
}

export default JobsRoute;
