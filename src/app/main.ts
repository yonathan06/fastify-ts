import { ServerModule } from '../../';
import * as helmet from 'fastify-helmet';

import { MyRouteModule } from './routes/my-route';

@ServerModule({
  options: {
    logger: true,
  },
  plugins: [
    { registrar: helmet },
    //routes
    MyRouteModule,
  ],
})
export class MainServer {
  static start(port: number) {
    throw new Error('Not implemented');
  }
}
