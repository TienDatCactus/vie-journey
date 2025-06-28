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
import { Handshake } from 'socket.io/dist/socket-types';
import {
  AddMessage,
  DeleteMessage,
  PlanSection,
  PlanStateService,
  UpdateMessage,
} from './plan-state/plan-state.service';

interface WSUser {
  id: string;
  email: string;
  fullName: string;
}

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
  constructor(
    private readonly tripService: TripService,
    private readonly planService: PlanStateService,
  ) {}

  async handleConnection(client: Socket) {
    const tripId = client.handshake.auth.tripId as string;
    const user = client.handshake.auth.user as WSUser;
    if (!tripId || !user) {
      client.disconnect();
      return;
    }
    const trip = await this.tripService.findOne(tripId);
    if (!trip || !trip.tripmates.includes(user?.email)) {
      client.emit('unauthorizedJoin', {
        reason: 'You are not a participant in this trip plan.',
      });
      client.disconnect();
      return;
    }
    await client.join(tripId);
    console.log(`Client connected: ${client.id}`);
    console.log(
      `Client: ${JSON.stringify(client.handshake.auth?.user, null, 2)}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`Received ping from client: ${client.id}`, data);
    console.log(
      `Auth: ${JSON.stringify(client.handshake.auth?.user, null, 2)}`,
    );
    this.server.emit('pong', { message: 'pong', received: data });
  }

  // Payload: Doesn't work for non-array section
  // {
  //    section: "notes",
  //    item: {
  //        text: "abcxyz"
  //    }
  // }
  @SubscribeMessage('planItemAdded')
  handlePlanItemAdded<T extends PlanSection>(
    @MessageBody() data: AddMessage<T>,
    @ConnectedSocket() client: Socket,
  ) {
    const tripId = client.handshake.auth?.tripId as string;
    const user = client.handshake.auth?.user as WSUser;
    const itemId = this.planService.addItem(tripId, data.section, data.item);
    console.log(`Added item in section ${data.section}:`, data.item);
    console.log(`Added by user:`, user);

    this.server.to(tripId).emit('onPlanItemAdded', {
      section: data.section,
      item: { ...data.item, id: itemId },
      addedBy: user,
    });
  }

  // Payload:
  // {
  //    section: "notes", // Type array
  //    item: {
  //        id: uuid1,
  //        text: "updated abcxyz"
  //    }
  // }
  //
  // or
  //
  // {
  //    section: "expenses", // Type non-array
  //    item: {
  //        placeholder1: "update part of the expenses object"
  //    }
  // }
  @SubscribeMessage('planItemUpdated')
  handlePlanItemUpdated<T extends PlanSection>(
    @MessageBody() data: UpdateMessage<T>,
    @ConnectedSocket() client: Socket,
  ) {
    const tripId = client.handshake.auth?.tripId as string;
    const user = client.handshake.auth?.user as WSUser;
    this.planService.updateItem(tripId, data.section, data.item);
    console.log(`Updated item in section ${data.section}:`, data.item);
    console.log(`Updated by user:`, user);
    this.server.to(tripId).emit('onPlanItemUpdated', {
      section: data.section,
      item: data.item,
      updatedBy: user,
    });
  }

  // Payload: Doesn't work for non-array section
  // {
  //    section: "notes",
  //    itemId: uuid1
  // }
  @SubscribeMessage('planItemDeleted')
  handlePlanItemDeleted<T extends PlanSection>(
    @MessageBody() data: DeleteMessage<T>,
    @ConnectedSocket() client: Socket,
  ) {
    const tripId = client.handshake.auth?.tripId as string;
    const user = client.handshake.auth?.user as WSUser;
    this.planService.deleteItem(tripId, data.section, data.itemId);
    console.log(`Deleted item in section ${data.section}:`, data.itemId);
    console.log(`Deleted by user:`, user);
    this.server.to(tripId).emit('onPlanItemDeleted', {
      section: data.section,
      itemId: data.itemId,
      deletedBy: user,
    });
  }
}
