import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


// API endpoint для Next.js сервера
app.post('/api/internal/record', (req, res) => {
  const data = req.body;
  broadcastToClients(data);
  res.status(200).send({ success: true });
});

function broadcastToClients(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
