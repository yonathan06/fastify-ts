# fastify-ts

An experimental fastify server with typescript and decorators
you can clone it, install dependencies and start with `npm start`

all decorators are under `index.ts` in the root folder.

code example with Route decorator that will be under `src/app/routes/my-route/index.ts`:
```typescript
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { RouteModule, Get } from '@fastify-ts'; //Doesn't really exists at npm

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
```

declaring the main server module (which consumes other routes modules and plugins)
will be under `src/app/main.ts`:
```typescript
import { ServerModule } from '@fastify-ts'; //Doesn't really exists at npm;
import * as helmet from 'fastify-helmet';
import { MyRouteModule } from './routes/tweet';

@ServerModule({
  options: {
    logger: {
      prettyPrint: true,
    },
  },
  plugins: [
    { registrar: helmet },
    //routes
    MyRouteModule,
  ],
})
export class MainServer {
}
```

all we have left is starting our server to listen in a given port
will be under `src/app/index.ts`:
```typescript
import { MainServer } from './app/main';

const start = async () => {
  const PORT = Number(process.env.PORT) || 3000;
  const server = MainServer.create();
  await server.listen(PORT);
};
start();
```

