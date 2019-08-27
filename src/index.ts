import { MainServer } from './app/main';

const start = async () => {
  const PORT = Number(process.env.PORT) || 3000;
  await MainServer.start(PORT);
};
start();