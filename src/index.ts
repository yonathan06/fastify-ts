import { MainServer } from './app/main';

const start = async () => {
  const PORT = Number(process.env.PORT) || 3000;
  const server = MainServer.create();
  await server.listen(PORT);
};
start();