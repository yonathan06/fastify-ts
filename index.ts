import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export const RouteModule = (opts: { authentication?: string }) => {
  const { authentication } = opts;
  return (target: any) => {
    target.registrar = (
      server: fastify.FastifyInstance,
      opts: { [key: string]: string } | undefined,
      done: Function
    ) => {
      const instance = new target(server);
      if (instance.postEndpoints) {
        instance.postEndpoints.forEach(
          (
            args: [
              string,
              fastify.RouteShorthandOptions,
              fastify.RequestHandler
            ]
          ) => {
            let [path, opts, handler] = args;
            if (authentication) {
              if (!opts) {
                opts = {};
              }
              if (!Array.isArray(opts.preHandler)) {
                opts.preHandler = [];
              }
              opts.preHandler.push(instance['server'][authentication]);
            }
            server.post(path, opts, handler.bind(instance));
          }
        );
      }
      if (instance.getEndpoints) {
        instance.getEndpoints.forEach(
          (
            args: [
              string,
              fastify.RouteShorthandOptions,
              fastify.RequestHandler
            ]
          ) => {
            let [path, opts, handler] = args;
            if (authentication) {
              if (!opts) {
                opts = {};
              }
              if (!Array.isArray(opts.preHandler)) {
                opts.preHandler = [];
              }
              opts.preHandler.push(instance['server'][authentication]);
            }
            server.get(path, opts, handler.bind(instance));
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

export const ServerModule = (options: {
  options?: fastify.ServerOptions;
  plugins: Array<{
    registrar: fastify.Plugin<Server, IncomingMessage, ServerResponse, any>;
    opts?: fastify.ServerOptions;
  }>;
}) => {
  return (target: any) => {
    target.start = async (port: number) => {
      // Create a http server. We pass the relevant typings for our http version used.
      // By passing types we get correctly typed access to the underlying http objects in routes.
      // If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>
      const server: fastify.FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse
      > = fastify({
        logger: {
          prettyPrint: true,
        },
      });
      const { plugins } = options;
      plugins.forEach(plugin => {
        server.register(plugin.registrar, plugin.opts);
      });
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
