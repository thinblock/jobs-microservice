import * as restify from 'restify';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from 'restify-errors';
import { IOAuthToken } from '../interfaces/utils/JWT';
import { config } from '../../config/env';
import { IRequest, IResponse } from '../interfaces/utils/IServer';

const oAuth = async (req: IRequest, res: IResponse, next: restify.Next) => {
  // not yet defined
  const tokenHeader: string = <string>(req.headers.authorization || req.headers.Authorization);

  const token = (tokenHeader || '').split(' ')[1]; // Token is of the form 'Bearer asdfsa'
  if (!token) {
    return res.send(new UnauthorizedError({
      message: 'No Access Token was specified in the Request Headers '
                + 'or Access Token is not in form "Bearer <token>"'
    }));
  }
  let decodedToken: IOAuthToken = null;

  try {
    decodedToken = <IOAuthToken>verify(token, config.oAuthSecret);
    if (!decodedToken) {
      return res.send(new UnauthorizedError({
        message: 'Provided Access Token was invalid or expired'
      }));
    }

  } catch (e) {
    req.log.error(e);
    return res.send(new UnauthorizedError({
      message: 'Provided Access Token was invalid or expired'
    }));
  }
  req.client_id = decodedToken.client_id;
  return next();
};

export { oAuth };
