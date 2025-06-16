import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TripService } from './trip.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'trip',
  transports: ['websocket', 'polling'],
})
export class TripGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly tripService: TripService) {}

  async handleConnection(client: Socket) {
    const { tripId, email } = client.handshake.auth;
    if (!tripId || !email) {
      client.disconnect();
      return;
    }
    const trip = await this.tripService.findOne(tripId as string);
    if (!trip || !trip.tripmates.includes(email as string)) {
      client.disconnect();
      return;
    }
    await client.join(trip._id);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`Received ping from client: ${client.id}`, data);
    this.server.emit('pong', { message: 'pong', received: data });
  }
}
