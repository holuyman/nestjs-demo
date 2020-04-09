import { Controller, Get, Post, Put, Req, Body, Response, Delete, Param } from '@nestjs/common';

import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {

    }
    @Get('routes')
    async routes(@Response() res, @Req() request): Promise<any> {
        if (request.query.id == undefined) {
            request = ""
        }
        // debugger
        const promise = await this.roleService.getRoutes(request);
        const result = { code: 20000, data: promise }
        res.json(result);
    }
    @Get('roles')
    async roles(@Response() res): Promise<any> {
        const name = "";
        const promise = await this.roleService.getRoles(name);
        const result = { code: 20000, data: promise }
        res.json(result);


    }
    //更新角色
    @Put(':id')
    async updataRole(@Body() params): Promise<any> {
        // console.log(params)
        const promise = await this.roleService.updateRole(params);
        if (promise) {
            return { code: 20000, msg: 'success' };
        }

    }
    //删除角色
    @Delete(':id')
    async deleteRole(@Param() params): Promise<any> {
        // console.log(params)
        const promise = await this.roleService.deleteRole(params);
        if (promise) {
            return { code: 20000, msg: 'success' };
        }

    }
    @Post('addRole')
    async addRole(@Body() params): Promise<any> {
        const result = await this.roleService.addRole(params);
        if (result == 'success') {
            return {
                code: 20000, data: '添加成功'
            }
        } else {
            return {
                code: 20009, message: '添加失败'
            }
        }

    }

}