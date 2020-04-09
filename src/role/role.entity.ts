
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    role_name: string;
    @Column('time', { nullable: true })
    gen_time: string;
    @Column({ nullable: true })
    description: string;
}
