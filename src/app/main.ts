import { ServerModule } from '../../';
import * as helmet from 'fastify-helmet';

import { TwitterModule } from './routes/tweet';

@ServerModule({
  options: {
    logger: {
      prettyPrint: true,
    },
  },
  plugins: [
    { registrar: helmet },
    //routes
    TwitterModule,
  ],
})
export class MainServer {
  static start(port: number) {
    throw new Error('Not implemented');
  }
}
