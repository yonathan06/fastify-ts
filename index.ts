// tslint:disable: variable-name no-any prefer-const
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export interface RouteModuleClass<T> extends Function {
  new (server: fastify.FastifyInstance, ...args: any[]): T;
  registrar: fastify.Plugin<Server, IncomingMessage, ServerResponse, any>;
  opts?: { [key: string]: any };
}

export const RouteModule = (
  params: {
    subRoutes?: Array<RouteModuleClass<any>> | any[];
    authentication?: string;
  } = {
    subRoutes: [],
  }
) => {
  const { authentication, subRoutes } = params;
  return (target: any): RouteModuleClass<any> => {
    target.registrar = (
      server: fastify.FastifyInstance,
      opts: { [key: string]: string } | undefined,
      done: Function
    ) => {
      const instance = new target(server);
      if (subRoutes) {
        subRoutes.forEach(route => {
          server.register(route.registrar);
        });
      }
      if (instance.postEndpoints) {
        instance.postEndpoints.forEach(
          (
            endpoint: [
              string,
              fastify.RouteShorthandOptions | Function,
              fastify.RequestHandler
            ]
          ) => {
            registerEndpoint(
              instance,
              endpoint,
              authentication,
              server,
              'post'
            );
          }
        );
      }
      if (instance.getEndpoints) {
        instance.getEndpoints.forEach(
          (
            endpoint: [
              string,
              fastify.RouteShorthandOptions | Function,
              fastify.RequestHandler
            ]
          ) => {
            registerEndpoint(instance, endpoint, authentication, server, 'get');
          }
        );
      }
      done();
    };
    return target;
  };
};

export const Post = (
  path: string,
  opts: fastify.RouteShorthandOptions = {}
) => {
  return (
    target: { server: fastify.FastifyInstance; [key: string]: any },
    key: string
  ) => {
    if (!target.postEndpoints) {
      target.postEndpoints = [];
    }
    target.postEndpoints.push([path, opts, target[key]]);
  };
};

export const Get = (path: string, opts: fastify.RouteShorthandOptions = {}) => {
  return (
    target: { server: fastify.FastifyInstance; [key: string]: any },
    key: string
  ) => {
    if (!target.getEndpoints) {
      target.getEndpoints = [];
    }
    target.getEndpoints.push([path, opts, target[key]]);
  };
};

export interface ServerModuleClass<T> extends Function {
  new(...args: any[]): T;
  port: number;
  create: () => fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
  start: () => fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
}

export const ServerModule = (params: {
  options?: fastify.ServerOptions;
  plugins: Array<Partial<RouteModuleClass<any>>>;
}) => {
  return (target: any): ServerModuleClass<any> => {
    target.create = () => {
      const { plugins, options } = params;
      // Create a http server. We pass the relevant typings for our http version used.
      // By passing types we get correctly typed access to the underlying http objects in routes.
      // If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>
      const server: fastify.FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse
      > = fastify(options);
      const request = (opts: string | fastify.HTTPInjectOptions) => {
        return new Promise((resolve, reject) => {
          server.inject(opts, (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
        });
      };
      server.decorate('request', request);
      plugins.forEach(plugin => {
        server.register(
          plugin.registrar as fastify.Plugin<
            Server,
            IncomingMessage,
            ServerResponse,
            any
          >,
          plugin.opts
        );
      });
      return server;
    };

    target.start = async (port: number) => {
      const server = target.create();
      try {
        server.listen(port);
      } catch (err) {
        server.log.error(err);
        process.exit(1);
      }
      return server;
    };
    return target;
  };
};

function registerEndpoint(
  instance: any,
  endpoint: [
    string,
    fastify.RouteShorthandOptions | Function,
    fastify.RequestHandler
  ],
  authentication: string | undefined,
  server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>,
  httpMethod: 'get' | 'post' | 'put' | 'delete'
) {
  let [path, opts, handler] = endpoint;
  if (authentication) {
    if (!opts) {
      opts = {};
    }
    if (typeof opts === 'function') {
      opts = opts.bind(server)() as fastify.RouteShorthandOptions;
    }
    if (!Array.isArray(opts.preHandler)) {
      opts.preHandler = [];
    }
    opts.preHandler.push(instance['server'][authentication]);
  }
  server[httpMethod](
    path,
    opts as fastify.RouteShorthandOptions,
    handler.bind(instance)
  );
}

// extend fastify typings
declare module 'fastify' {
  interface FastifyInstance<HttpServer, HttpRequest, HttpResponse> {
    request: (
      opts: string | fastify.HTTPInjectOptions
    ) => Promise<fastify.HTTPInjectResponse>;
  }
}
