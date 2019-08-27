import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { RouteModule, Get } from '../../../../index';

@RouteModule({})
export class TwitterModule {
  static opts: fastify.ServerOptions;
  static registrar() {
    throw new Error('Method not implemented.');
  }
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
