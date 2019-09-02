import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { RouteModule, Get } from '../../../../index';

@RouteModule()
export class MyRouteModule {
  constructor(
    public server: fastify.FastifyInstance<
      Server,
      IncomingMessage,
      ServerResponse
    >
  ) {
  }

  @Get(`/ping`)
  async ping(
    request: fastify.FastifyRequest,
    replay: fastify.FastifyReply<ServerResponse>
  ) {
    return `pong`;
  }
}
