import {
    instanceOfConnClosed,
    instanceOfGroupUpdate,
    instanceOfInfoPacket,
    instanceOfKeepAlive, instanceOfRoomPacket,
    isString
} from "../components/Helper";
import {
    Connection_Closed_Packet,
    DeserializePacket,
    Group_Update_Packet,
    Info_Packet,
    Keep_Alive_Packet,
    Room_Packet, RoomPacket
} from "./Packets";
import {SOCKET_URL} from "../components/Global";

// export class ClientSocket {
    // public socket: WebSocket
    //
    // private groupUpdateCallback: (ready: Map<number, boolean>) => void
    // private roomPacketCallback: (packet: RoomPacket) => void
    //
    // constructor(
    //     socketID: number,
    //     token: string,
    //     groupUpdateCallback: (ready: Map<number, boolean>) => void,
    //     roomPacketCallback: (packet: RoomPacket) => void) {
    //     this.socket = new WebSocket(`${SOCKET_URL}/socket/${socketID}`)
    //
    //     this.socket.onopen = (event: Event) => {
    //         this.socket.send(token);
    //     }
    //
    //     this.socket.onmessage = (event: MessageEvent) => {
    //         this.handleMessage(this.socket, event)
    //     }
    //
    //     this.groupUpdateCallback = groupUpdateCallback
    //     this.roomPacketCallback = roomPacketCallback
    //
    //     this.handleMessage = this.handleMessage.bind(this)
    //
    //     this.handleGroupUpdate = this.handleGroupUpdate.bind(this)
    //     this.handleRoomPacket = this.handleRoomPacket.bind(this)
    // }
    //
    //
    // private handleMessage(socket: WebSocket, event: MessageEvent) {
    //     if (isString(event.data)) {
    //         console.log(event.data)
    //         const res = DeserializePacket(event.data);
    //         console.log(res)
    //         if(res !== undefined) {
    //             instanceOfConnClosed(res) ? this.handleConnClosed(res)
    //                 : instanceOfGroupUpdate(res) ? this.handleGroupUpdate(res)
    //                 : instanceOfInfoPacket(res) ? this.handleInfoPacket(res)
    //                     : instanceOfKeepAlive(res) ? this.handleKeepAlive(socket, res)
    //                         : instanceOfRoomPacket(res) ? this.handleRoomPacket(res)
    //                             : console.log(res)
    //         }
    //     } else {
    //
    //     }
    // }
    //
    // private handleConnClosed(packet: Connection_Closed_Packet) {
    //     console.log(packet.Payload.reason)
    // }
    //
    // private handleGroupUpdate(packet: Group_Update_Packet) {
    //     this.groupUpdateCallback(packet.Payload.ReadySockets)
    // }
    //
    // private handleInfoPacket(packet: Info_Packet) {
    //     console.log(packet.Payload)
    // }
    //
    // private handleRoomPacket(packet: Room_Packet) {
    //     this.roomPacketCallback(packet.Payload)
    // }
    //
    // private handleKeepAlive(socket: WebSocket, packet: Keep_Alive_Packet) {
    //     socket.send("Alive")
    // }
// }