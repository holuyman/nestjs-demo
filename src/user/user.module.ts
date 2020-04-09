import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module'
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { RoleService } from 'src/role/role.service';
import { EventsGateway } from '../events/events.gateway'
@Module({
    imports: [TypeOrmModule.forFeature([User]), RoleModule],
    providers: [UserService, RoleService, EventsGateway],
    controllers: [UserController],
    exports: [TypeOrmModule]
})
export class UserModule { }