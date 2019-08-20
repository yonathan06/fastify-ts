import { RouteShorthandOptions } from 'fastify';
import { server } from './app/main';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
}

// tslint:disable-next-line: variable-name
export const Route = (
  path: string,
  method: HttpMethod,
  opts: RouteShorthandOptions
): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
  ) => {
    const handler = target[propertyKey];
    const basePath = target['basePath'];
    if (basePath) {
      path = basePath + path;
    }
    server[method](path, opts, handler);
  };
};
