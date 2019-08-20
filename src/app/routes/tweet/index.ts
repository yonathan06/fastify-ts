import { ServerResponse } from 'http';
import { FastifyRequest, FastifyReply } from 'fastify/fastify';
import { Route, HttpMethod } from '../../../fastify-ts';

export class Tweet {
  @Route('/tweet', HttpMethod.GET, {})
  async get(request: FastifyRequest, reply: FastifyReply<ServerResponse>) {
    console.log('get tweet has been called');
    return { pong: 'tweet' };
  }
}
