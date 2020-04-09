import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Photo } from './photo/photo.entity'
import { User } from './user/user.entity'
import { Role } from './role/role.entity'
import { PhotoModule } from './photo/photo.module'
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EventsGateway } from './events/events.gateway'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'zhcl',
      entities: [Photo, User, Role],
      synchronize: true,
    }), PhotoModule, UserModule, RoleModule
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule { }
