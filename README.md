# fastify-ts

An experimental fastify server with typescript and decorators

code example with Route decorator

```typescript
import { ServerResponse } from 'http';
import { FastifyRequest, FastifyReply } from 'fastify/fastify';
import { Route, HttpMethod } from '../../../fastify-ts';

export class Tweet {
  @Route({
    path: '/tweet',
    method: HttpMethod.GET,
    opts: {},
  })
  async get(request: FastifyRequest, reply: FastifyReply<ServerResponse>) {
    console.log('get tweet has been called');
    return { tweet: 'I am a bird' };
  }
}
```
