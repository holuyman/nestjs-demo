import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './role.entity'

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly roleRepsitory: Repository<Role>) { }
    async seleRoutes(params): Promise<any> {
        let sql = `select * from routes r `
        if (params != null && params != "") {
            sql += ' where r.parent_id=' + params
        } else {
            sql += ' where r.parent_id=0'
        }
        return await this.roleRepsitory.query(sql)
    }
    async seleRoutesByRole(roleName, parentId) {
        let sql = `select * from routes r where r.id in (select route_id from roleroutes ro where ro.role_id in (select id from role where role_name='${roleName}')) `
        if (parentId != null && parentId != "") {
            sql += ' and r.parent_id=' + parentId
        } else {
            sql += ' and r.parent_id=0'
        }
        return await this.roleRepsitory.query(sql)
    }
    /**
     * 递归查询路由
     * @param department
     * @return
     */
    async getRoutes(parentId) {
        const routes = await this.seleRoutes(parentId);
        if (routes.length > 0) {
            for (let i = 0; i < routes.length; i++) {
                const rous = await this.getRoutes(routes[i]['id']);
                [routes[i]['meta']] = await this.getMetaByRouteId(routes[i]['id'])
                if (rous.length > 0) {
                    routes[i]['children'] = rous
                }

            }
        }
        return routes;
    }
    async getMetaByRouteId(routeId) {
        const sql = `select * from  routesMeta ro where route_id='${routeId}' `
        return await this.roleRepsitory.query(sql)
    }
    async getRoles(name) {

        // key: "admin"
        // name: "admin"
        // description: "Super Administrator. Have access to view all pages."
        // routes: [{path: "/redirect", component: "layout/Layout", hidden: true,…},…]
        // 0: {path: "/redirect", component: "layout/Layout", hidden: true,…}
        //1.获取所有的角色
        let roSql = `SELECT role_name name,id,description from role`;
        if (name != undefined && name != "") {
            roSql += ` where role_name='${name}'`
        }
        const ros = await this.roleRepsitory.query(roSql)

        if (ros && ros.length > 0) {
            for (let i = 0; i < ros.length; i++) {
                ros[i].key = ros[i].name
                const routes = await this.getRouteByRole(ros[i].id);
                ros[i].routes = routes;
            }

        }


        return ros
    }
    async getRouteByRole(roleId) {
        const sql = `select r.role_name,r.role_name name,ro.path,r.description from role r,roleroutes rr,routes ro where r.id=rr.role_id and ro.id=rr.route_id and r.id='${roleId}'`;
        return await this.roleRepsitory.query(sql)

    }
    async getRoutesByRole(roleName, parentId) {
        const routes = await this.seleRoutesByRole(roleName, parentId);
        if (routes.length > 0) {
            for (let i = 0; i < routes.length; i++) {
                const rous = await this.getRoutesByRole(roleName, routes[i]['id']);
                [routes[i]['meta']] = await this.getMetaByRouteId(routes[i]['id'])
                if (rous.length > 0) {
                    routes[i]['children'] = rous
                }

            }
        }
        return routes;
    }

    async updateRole(params) {
        //更新角色
        //1.角色表 2.角色路由表
        //更新角色表
        const upRole = `update role set description='${params.description}',role_name='${params.name}' where id=${params.id}`
        this.roleRepsitory.query(upRole)
        //更新角色路由表，判断是否已经存在  如果不存在添加 
        // if (params && params.routes.length > 0) {
        //应该都删除再添加

        await this.roleRepsitory.query(`delete from roleroutes where role_id=${params.id}`)
        if (params && params.routes.length > 0) {
            this.addRoleRoute(params.routes, params.name)
        }

        // return await this.roleRepsitory.query(sql)
        return 'success';
    }
    async addRoleRoute(routes, role) {
        for (let i = 0; i < routes.length; i++) {

            const querysql = `SELECT * from roleroutes where route_id in (SELECT id from routes where path='${routes[i].path}') and role_id in (select id from role where role.role_name='${role}')`
            const route = await this.roleRepsitory.query(querysql)
            //循环每一条添加
            if (route && route.length == 0) {//这个角色没有这个路由，需要添加
                //查询角色id 和路由id
                const [id] = await this.roleRepsitory.query(`select id from routes where path='${routes[i].path}'`)
                const [roleId] = await this.roleRepsitory.query(`select id from role where role_name='${role}'`)
                const insSql = `insert into roleroutes(role_id,route_id) values (${roleId.id},${id.id})`
                this.roleRepsitory.query(insSql)
            }
            if (routes[i].children && routes[i].children.length > 0) {


                this.addRoleRoute(routes[i].children, role)
            }
        }
    }
    // async login(req) {
    //     // const user = this.userRepsitory.find((params) => params.username === username);
    //     // if (!user) {
    //     //     throw new HttpException("User not found", 404);
    //     // }
    //     // return Promise.resolve(user);
    //     // console.log(req)
    //     // return await this.userRepsitory.findOne({ username: req.username, password: req.password })
    //     const sql = `select * from user  where username='${req.username}' and password='${req.password}'`;
    //     return await this.roleRepsitory.query(sql)
    // }
    // async getInfo(params) {
    //     const sql = `select * from auth  where token='${params.token}'`;
    //     return await this.roleRepsitory.query(sql)
    // }
    // async updateUser(params) {
    //     params = JSON.parse(params)
    //     const sql = `update user  set  username='${params.username}' , password='${params.password}' , name='${params.name}' , telnum='${params.telnum}' where id=${params.id}`;
    //     // console.log(sql);
    //     return await this.roleRepsitory.query(sql)
    // }
    //添加角色
    async addRole(params) {
        //添加角色  
        /**
         * 1.在角色表中添加(判断该角色是否存在，如果存在则提示该角色已存在)
         * 2.如果用路由则在角色路由表中也添加
         */
        const isExistRole = await this.roleRepsitory.findOne({ 'role_name': params.name })
        if (isExistRole) {
            return 'faile'
        }
        const insRole = `insert into \`role\` (\`description\`,\`role_name\`) values ('${params.description}','${params.name}')`;
        this.roleRepsitory.query(insRole)
        // 查询角色之前是否有该角色的信息，为了防止脏数据产生
        const role = await this.roleRepsitory.findOne({ 'role_name': params.name })
        //应该都删除再添加
        if (role) {
            await this.roleRepsitory.query(`delete from roleroutes where role_id=${role.id}`)
            if (params && params.routes.length > 0) {
                this.addRoleRoute(params.routes, role.role_name)
            }
        }


        // return await this.roleRepsitory.query(sql)
        return 'success';

    }
    //删除角色
    async deleteRole(params) {
        //  1.先删除角色路由表数据
        //  2.再删除角色表数据
        const roleId = await this.roleRepsitory.findOne({ 'role_name': params.id })
        if (roleId) {
            //删除路由表数据
            await this.roleRepsitory.query(`delete from roleroutes where role_id=${roleId.id}`);
            return await this.roleRepsitory.delete({ 'role_name': params.id })
        }

    }
}