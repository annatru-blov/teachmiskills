import { Controller, Get, Inject, Param, Post, Body, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, retry, catchError, throwError } from 'rxjs';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Get(':id')
  getUser(@Param('id') id: number) {
    return lastValueFrom(this.client.send('get-user', { id }));
  }

  // @Post()
  // createUser() {
  //   this.client.emit('user-created', { id: Date.now() });
  //   return { status: 'ok' };
  // }

    @Post()
  createUser(@Req() req, @Body() body: {name: string}) {
    const requestId = randomUUID();
    const traceId = req.trace;

    const result = this
    .client
    .send('create-user', {
    requestId,
    name: body.name,
    })
    .pipe(
      retry(3),
      catchError((err) => {
        console.error('[gateway] create-user failed after retries', {
          traceId,
          error: err?.message ?? err,
          requestId, 
        });
        return throwError(
          () => new Error('user service unavailable, try later'),
        );
      }),
    )
    return lastValueFrom(result);
  }
}