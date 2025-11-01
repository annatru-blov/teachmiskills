import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [forwardRef(() => TasksModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
// export interface AuthModuleOptions {
//   secret: string;
//   tokenPrefix: string;
// }

// @Module({})
// export class AuthModule {
//   static forRoot(options: AuthModuleOptions): DynamicModule {
//     return {
//       module: AuthModule,
//       imports: [forwardRef(() => TasksModule)],
//       providers: [
//         {
//           provide: 'AUTH_OPTIONS',
//           useValue: options,
//         },
//       ],
//       exports: [AuthService],
//     };
//   }
// }
