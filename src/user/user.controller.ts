import { Controller, Inject, Get, Post, Param, Req, HttpCode, HttpStatus, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service'
import { EventsGateway } from '../events/events.gateway'
import { User } from './user.entity';
import { Role } from 'src/role/role.entity';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Controller('user')
export class UserController {
    constructor(@Inject('UserService') private userService: UserService, private readonly roleService: RoleService, private readonly eventsGateway: EventsGateway) {

    }
    @Get('queryUser')
    async queryUser(@Req() request): Promise<any> {
        // debugger
        const promise = this.userService.queryUser(request);
        const result = await promise;
        return { code: 20000, total: result.length, data: result };
    }
    @Get('test')
    test(): string {
        return '111'
    }
    //登录接口
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() params) {
        const a = await this.userService.login(params);
        const result: any = {}
        if (a.length > 0) {
            if (a[0].password == params.password) {//如果密码不匹配 则密码不正缺
                result.data = { "token": a[0]['role_name'] + '-token', "username": params.username }
                result.code = 20000;
            } else {
                result.message = '密码不正确，请重新输入密码'
                result.code = 20008;
            }

        } else {
            result.message = '用户名不存在';

            result.code = 20001;
        }


        return result;
    }
    //获取用户信息
    @Get('info')
    async getInfo(@Query() params): Promise<any> {
        // console.log(params)
        // throw new ApiException('用户ID无效', ApiErrorCode.USER_ID_INVALID, HttpStatus.BAD_REQUEST);
        const [userInfo] = await this.userService.getInfo(params.username);
        let role = 'admin'
        if (params && params.token) {
            role = params.token.split('-')[0]
        }
        const routes = await this.roleService.getRoutesByRole(role, "")

        const result = {
            code: 20000,
            data: {
                roles: [userInfo.roles],
                introduction: userInfo.comment,
                avatar: userInfo.avatar,
                name: userInfo.name,
                routes: routes
            }
        }
        try {
            //socket推送
            const server = this.eventsGateway.server
            //console.log(server)
            const sockets = server.sockets
            // server.emit('test', { hello: 'world' });
            const i = 0
            const charts = {
                unit: 'Kbps',
                names: ['出口', '入口'],
                lineX: [
                    '2018-11-11 17:01',
                    '2018-11-11 17:02',
                    '2018-11-11 17:03',
                    '2018-11-11 17:04',
                    '2018-11-11 17:05',
                    '2018-11-11 17:06',
                    '2018-11-11 17:07',
                    '2018-11-11 17:08',
                    '2018-11-11 17:09',
                    '2018-11-11 17:10',
                    '2018-11-11 17:11',
                    '2018-11-11 17:12',
                    '2018-11-11 17:13',
                    '2018-11-11 17:14',
                    '2018-11-11 17:15',
                    '2018-11-11 17:16',
                    '2018-11-11 17:17',
                    '2018-11-11 17:18',
                    '2018-11-11 17:19',
                    '2018-11-11 17:20',
                ],
                value: [
                    [
                        451,
                        352,
                        303,
                        534,
                        95,
                        236,
                        217,
                        328,
                        159,
                        151,
                        231,
                        192,
                        453,
                        524,
                        165,
                        236,
                        527,
                        328,
                        129,
                        530,
                    ],
                ],
            }
            server.emit('test', charts);
            setInterval(() => {
                server.emit('test', charts);

            }, 10000)
            // console.log(sockets)
            // Object.keys(sockets).forEach((key) => {
            //     // console.log(key)
            //     let i = 0;
            //     (setInterval((key) => {

            //         sockets[key].emit('test', { hello: 'world', i: i++ });
            //     }, 1000, key))(key)

            // })
        } catch (error) {
            console.log(error)
        }

        // return 'hello'
        return result;

    }
    //退出
    @Post('logout')
    async logOut() {
        return {
            code: 20000,
            data: 'success'
        };
    }
    //修改用户
    @Post('updateUser')
    async updateUser(@Query() params) {
        const promise = this.userService.updateUser(params.userInfo);
        const result = await promise;
        console.log(result)
        return {
            code: 20000,
            data: 'success'
        };
    }
    @Post('addUser')
    async addUser(@Query() params) {
        //先判断有没有这个用户  没有则添加 有则提示已存在此用户

        const promise = await this.userService.addUser(params.userInfo);
        if (promise['affectedRows'] && promise['affectedRows'] == 1) {
            return {
                code: 20000,
                data: 'success'
            }
        } else {
            return {
                code: 20008,
                message: '此用户已存在'

            }
        }


    }
    @Post('removeUser')
    async removeUser(@Query() params): Promise<any> {
        const result = await this.userService.removeUser(params.userInfo);
        if (result && result.affected > 0) {
            return {
                code: 20000,
                data: '删除成功'
            }
        } else {
            return {
                code: 20008,
                message: '删除失败'
            }
        }
    }
    //批量删除
    @Post('delUser')
    async delUser(@Query() params): Promise<any> {
        const result = await this.userService.BatchDelUser(params.ids);
        if (result && result['affectedRows'] > 0) {
            return {
                code: 20000,
                data: '删除成功'
            }
        } else {
            return {
                code: 20008,
                message: '删除失败'
            }
        }
    }

}