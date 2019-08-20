import { RouteShorthandOptions } from 'fastify';
import { server } from './app/main';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
}

// tslint:disable-next-line: variable-name
export const Route = (options: {
  path: string;
  method: HttpMethod;
  opts: RouteShorthandOptions;
}): MethodDecorator => {
  // tslint:disable-next-line: no-any
  return (target: any, propertyKey: string | symbol) => {
    // tslint:disable-next-line: prefer-const
    let { path, method, opts } = options;
    const handler = target[propertyKey];
    const basePath = target['basePath'];
    if (basePath) {
      path = basePath + path;
    }
    server[method](path, opts, handler);
  };
};
