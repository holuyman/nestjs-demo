import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import * as url from 'url'
const l = console.log

@WebSocketGateway({ namespace: 'socket', port: 3001 })
export class EventsGateway {
    @WebSocketServer() server;

    private clientsArr: any[] = [];
    // socket.on('message', function(msg) {
    //     console.log(msg);   // 这个就是客户端发来的消息
    // });
    handleConnection(client: any) {
        console.log('有人连接了' + client.id)
        client.server.emit('events', { name: '李四', age: 23 })
    }
    handleDisconnect(client: any) {

    }
    @SubscribeMessage('addCart')
    addCart(client: any, payload: any) {
        console.log(payload)
        const roomid = url.parse(client.request.url, true).query.roomid;//获取房间号 获取桌号
        client.join(roomid);
        // client.broadcast.to(roomid).emit('addCart', 'Server Addcart OK') //广播所有人   不包含自己
        client.server.to(roomid).emit('addCart', 'Server Addcart OK') //广播所有人   包含自己
    }
    @SubscribeMessage('events')
    onEvent(client: any, payload: any): Observable<WsResponse<any>> | any {
        const { name } = payload;
        if (name == 'ajanuw') {
            return of({
                event: 'events',
                data: {
                    msg: 'hello ajanuw!'
                }
            })
        }
        if (name == 'alone') {
            return of('hi', '实打实')
                .pipe(map($_ => ({
                    event: 'events',
                    data: {
                        msg: $_
                    }
                })))
        }
        return of(payload)
    }
}