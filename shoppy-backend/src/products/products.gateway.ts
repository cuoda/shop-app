import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService, AUTH_COOKIE } from '../auth/auth.service';

export interface ProductEvent {
  productId: number;
  type: 'created' | 'sold' | 'updated';
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class ProductsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly authService: AuthService) {}

  handleConnection(client: Socket) {
    try {
      const token = this.getTokenFromCookie(client);
      if (!token) throw new Error('Missing token');
      this.authService.verifyToken(token);
    } catch {
      client.emit('unauthorized');
      client.disconnect(true);
    }
  }

  emitProductUpdated(payload: ProductEvent) {
    this.server.emit('productUpdated', payload);
  }

  private getTokenFromCookie(client: Socket): string | undefined {
    const raw = client.handshake.headers.cookie;
    if (!raw) return undefined;
    for (const part of raw.split(';')) {
      const [name, ...rest] = part.trim().split('=');
      if (name === AUTH_COOKIE) return decodeURIComponent(rest.join('='));
    }
    return undefined;
  }
}
