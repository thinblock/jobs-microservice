import ActionsController from './actions.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class ActionsRoute implements IRoute {
  public basePath = '/actions';
  public controller = new ActionsController();

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
              description: Joi.string().required(),
              params_schema: Joi.array().items(Joi.object().keys({
                required: Joi.bool().default(false),
                name: Joi.string().required(),
                type: Joi.string().valid(['string', 'number', 'boolean']).required(),
              }))
            }).required()
          }
        },
      }
    ];
  }
}

export default ActionsRoute;
