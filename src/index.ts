import { server } from './app/main';

const start = async () => {
  try {
    await server.listen(3000);
    console.log(`server listening on ${3000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
