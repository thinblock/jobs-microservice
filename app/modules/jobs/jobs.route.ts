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
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.getAll,
        validation: {
          schema: {
            query: {
              trigger: Joi.string(),
              active: Joi.boolean()
            }
          }
        }

      },
      {
        method: HttpMethods.GET,
        auth: AuthStrategies.PUBLIC,
        handler: this.controller.get,
        param: 'jobId',
        validation: {
          schema: {
            params: {
              jobId: Joi.when('look_up', {
                is: '_id',
                then: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                otherwise: Joi.string().regex(
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                )
              }).required(),
              look_up: Joi.string().valid(['_id', 'token'])
            }
          }
        }
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
              notification: Joi.object().keys({
                type: Joi.string().valid(['WEBHOOK', 'SMS', 'EMAIL']).default('WEBHOOK'),
                token: Joi.string(),
                value: Joi.string()
                  .when('type', { is: 'WEBHOOK', then: Joi.string().uri() })
                  .concat(Joi.string().when('type', { is: 'EMAIL', then: Joi.string().email() })
                  .required())
              }).required(),
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
