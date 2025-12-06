import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

interface CreateUserPayload {
  requestId: string;
  name: string;
}

const processedRequests = new Map<string, any>();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get-user')
  handleGetUser(@Payload() data: { id: number }) {
    return { id: data.id, name: 'John Doe' };
  }
  // @EventPattern('user-created')
  // handleUserCreated(@Payload() data: any) {
  //   console.log('[user-service] user created event received:', data);
  // }
  @MessagePattern('create-user')
  handleUserCreated(@Payload() data: any) {
    const { requestId, name } = data;

    console.log('[user-service] create user received:', data);

    if (processedRequests.has(requestId)) {
      console.log(
        '[user-service] duplicate req, returning cached result',
        requestId,
      );
      return processedRequests.get(requestId);
    }

    if (Math.random() < 0.5) {
      console.log('[user-service] failure, throwing RPC exeption', requestId);
      throw new Error('user creation error');
    }

    const createdUser = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
    };

    processedRequests.set(requestId, createdUser);
    console.log('[user-service] user created successfully', requestId);

    //this.client.emit('user-created', ... ) to do 

    return createdUser;
  }
}
