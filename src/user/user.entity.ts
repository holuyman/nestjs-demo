
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Tracing } from 'trace_events';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 20 })
    username: string;
    @Column()
    roles: string;
    @Column()
    password: string;
    @Column({ length: 20 })
    name: string;
    @Column({ length: 20 })
    telnum: string;
    @Column({ nullable: true })
    email: string;
    @Column({ nullable: true })
    comment: string;
    @Column('time', { nullable: true })
    gen_time: string;
    @Column('time', { nullable: true })
    login_time: string;
    @Column('time', { nullable: true })
    last_login_time: string;
    @Column({ nullable: true })
    avatar: string;

}
