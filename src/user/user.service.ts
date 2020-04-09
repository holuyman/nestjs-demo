import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { resolve } from 'dns';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepsitory: Repository<User>) { }
    async queryUser(params): Promise<any> {
        return await this.userRepsitory.query('select * from user')
    }
    async login(req) {
        // const user = this.userRepsitory.find((params) => params.username === username);
        // if (!user) {
        //     throw new HttpException("User not found", 404);
        // }
        // return Promise.resolve(user);
        // console.log(req)
        // return await this.userRepsitory.findOne({ username: req.username, password: req.password })
        const sql = `select * from user,role  where roles=role.id and username='${req.username}'`;
        return await this.userRepsitory.query(sql)
    }
    async getInfo(params) {
        const sql = `select * from user  where username='${params}'`;
        return await this.userRepsitory.query(sql)
    }
    async updateUser(params) {
        params = JSON.parse(params)

        const sql = `update user  set  username='${params.username}' , password='${params.password}' , name='${params.name}' , telnum='${params.telnum}' where id=${params.id}`;
        // console.log(sql);
        return await this.userRepsitory.query(sql)


    }
    async addUser(params) {
        params = JSON.parse(params)
        const findUser = await this.userRepsitory.findOne({ username: params.username })
        if (!findUser) {
            const sql = `insert into \`user\` (\`username\`,\`password\`,\`name\`,\`telnum\`,\`roles\`) values ('${params.username}','${params.password}','${params.name}','${params.telnum}','editor')`;
            // console.log(sql);
            return await this.userRepsitory.query(sql)
        } else {
            return '已存在';
        }

    }
    async removeUser(params) {
        params = JSON.parse(params)
        return await this.userRepsitory.delete({ id: params.id })

    }
    async BatchDelUser(params) {
        // params=JSON.parse(params)
        const sql = `delete from user where id in ('${params.replace('-', '\',\'')}')`
        return await this.userRepsitory.query(sql);
    }
}