import * as restify from 'restify';
import JobsController from './jobs.controller';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class JobsRoute implements IRoute {
  public basePath = '/jobs';
  public controller = new JobsController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.getAll,
      },
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object().keys({
              active: Joi.boolean().default(false),
              trigger: {
                id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                conditions: Joi.array().items(Joi.object().keys({
                  when: Joi.string().valid(['current_value']),
                  operation: Joi.string().valid(['$lt', '$lte', '$gt', '$gte', '$eq']),
                  argument: Joi.object().keys({
                    type: Joi.string().valid(['string', 'number', 'boolean']).required(),
                    value: Joi.string()
                  }).required()
                }))
              },
              actions: Joi.array().items(Joi.object().keys({
                action: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                params: Joi.object()
              })),
            }).required()
          }
        },
      },
      {
        method: HttpMethods.PUT,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.put,
        param: 'job_id',
        validation: {
          schema: {
            body: Joi.object().keys({
              last_run: {
                output: Joi.string(),
                date: Joi.date().required()
              }
            }).required(),
            params: {
              job_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            }
          }
        },
      }
    ];
  }
}

export default JobsRoute;
