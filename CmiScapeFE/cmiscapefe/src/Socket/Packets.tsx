export interface Socket_Packet {
    type: MessageType
    payload: string
}

export interface Typed_Packet {
    discriminator: string
    type: MessageType
}

export interface Group_Update_Packet extends Typed_Packet {
    discriminator: 'GROUP-UPDATE'
    Payload: GroupReadyUpdate
}

export interface Room_Packet extends Typed_Packet {
    discriminator: 'ROOM-PACKET'
    Payload: string
    packet: RoomPacket
}

export interface Keep_Alive_Packet extends Typed_Packet {
    discriminator: 'KEEP-ALIVE'
    Payload: KeepAlivePacket
}

export interface Connection_Closed_Packet extends Typed_Packet {
    discriminator: 'CONN-CLOSED'
    Payload: ConnectionClosedPacket
}

export interface Info_Packet extends Typed_Packet {
    discriminator: 'INFO-PACKET'
    Payload: string
}

export interface GroupReadyUpdate {
    ReadySockets: Array<ReadySocket>
}

export interface ReadySocket {
    playerID: number,
    ready: boolean
}

export interface KeepAlivePacket {
    Payload: string
}

export interface ConnectionClosedPacket {
    reason: string
}

export enum MessageType {
    GROUPREADYUPDATE,
    ROOMPACKET,
    KEEPALIVE,
    CONNECTIONCLOSED,
    INFO
}

export interface RoomPacket {
    roomName: string,
    roomID: number,
    POIs: Array<POIPacket>,
    Items: Array<ItemPacket>,
    Inventory: Array<ItemPacket>
}

export interface POIPacket {
    Info: InfoPacket,
    Dialogue: DialoguePacket
    IsTraversable: boolean
}

export interface InfoPacket {
    Description: string,
    Examine: string
}

export interface DialoguePacket {
    Root: DialogueNodePacket
}

export interface DialogueNodePacket {
    Children: Array<DialogueNodePacket>,
    OptionText: string,
    NextDialogueText: string,
    FunctionID: string,
    KeepOpen: boolean
}

export interface ItemPacket {
    id: number,
    info: InfoPacket,
    InfoID: number,
    ItemName: string
}

export function DeserializePacket(packet: string): Typed_Packet | undefined {
    switch (Number.parseInt(packet[8])) {
        case MessageType.GROUPREADYUPDATE:
            const groupReady: Group_Update_Packet = DeserializeGroupReadyUpdatePayload(packet)
            groupReady.discriminator = 'GROUP-UPDATE'
            return groupReady
        case MessageType.ROOMPACKET:
            var roomPacket: Room_Packet = DeserializeRoomPacketPayload(packet)
            roomPacket.discriminator = "ROOM-PACKET"
            roomPacket.packet = DeserializeRoomPacket(roomPacket.Payload)
            roomPacket.packet.roomName = getRoomName(roomPacket.Payload)
            roomPacket.packet.roomID = getRoomId(roomPacket.Payload)
            // roomPacket.packet.POIs.map(poi => AddOptionsToDialogue(poi.Dialogue.Root))
            console.log(roomPacket)
            return roomPacket
        case MessageType.KEEPALIVE:
            const keepAlive: Keep_Alive_Packet = DeserializeKeepAlivePayload(packet)
            keepAlive.discriminator = "KEEP-ALIVE"
            return keepAlive
        case MessageType.CONNECTIONCLOSED:
            const connClosed: Connection_Closed_Packet = DeserializeConnectionClosedPayload(packet)
            connClosed.discriminator = "CONN-CLOSED"
            return connClosed
        case MessageType.INFO:
            const info: Info_Packet = DeserializeInfoPayload(packet)
            info.discriminator = "INFO-PACKET"
            return info
        default:
            return undefined


    }
}

// export function AddOptionsToDialogue(node: DialogueNodePacket){
//     node.option = DeserializeOptionPacket(node.Option)
//     node.Children.map(child => AddOptionsToDialogue(child))
// }

export function DeserializePOIListPacket(poi: string): Array<POIPacket> {
    return JSON.parse(poi,) as Array<POIPacket>
}

// export function DeserializeOptionPacket(option: string): DialogueOptionPacket{
//     return JSON.parse(option) as DialogueOptionPacket
// }

export function DeserializeInfoPacket(info: string): InfoPacket {
    return JSON.parse(info) as InfoPacket
}

export function DeserializeDialoguePacket(dia: string): DialoguePacket {
    return JSON.parse(dia) as DialoguePacket
}

export function DeserializeDialogueNodePacket(dianode: string): DialogueNodePacket {
    return JSON.parse(dianode
    ) as DialogueNodePacket
}

export function DeserializeDialogueNodeListPacket(dianodelist: string): Array<DialogueNodePacket> {
    return JSON.parse(dianodelist) as Array<DialogueNodePacket>
}

export function DeserializeItemListPacket(item: string): Array<ItemPacket> {
    return JSON.parse(item) as Array<ItemPacket>
}

export function DeserializeRoomPacketPayload(payload: string): Room_Packet {
    return JSON.parse(payload,
    ) as Room_Packet
}

export function DeserializeRoomPacket(payload: string): RoomPacket {
    return JSON.parse(payload
        , (key, value) =>
            key === "POIs"
                ? value as Array<POIPacket>
                : key === "Items"
                ? value as Array<ItemPacket>
                : key === "Inventory"
                ? value as Array<ItemPacket>
                : key === "RoomName"
                    ? value as string
                        : key === "RoomID"
                            ? value as number
                            : key === "Info"
                                ? value as InfoPacket
                                : key === "Dialogue"
                                    ? value as DialoguePacket
                                    : key === "Root"
                                        ? value as DialogueNodePacket
                                        : key === "Children"
                                            ? value as Array<DialogueNodePacket>
                                            : value
    ) as RoomPacket


}

export function getRoomName(payload: string): string {
    var name: string = ""
    JSON.parse(payload,
        (key, value) =>
            key === "RoomName" ? name = value : value
    )
    return name
}

export function getRoomId(payload: string): number {
    var ID: number = -1
    JSON.parse(payload,
        (key, value) =>
            key === "RoomID" ? ID = value : value
    )
    return ID
}

export function DeserializeGroupReadyUpdatePayload(payload: string): Group_Update_Packet {
    var temp = JSON.parse(payload, (key, value) =>
        key === "Payload"
            ? value as GroupReadyUpdate
            : value
    ) as Group_Update_Packet
    return temp

}

export function DeserializeConnectionClosedPayload(payload: string): Connection_Closed_Packet {
    return JSON.parse(payload)
}

export function DeserializeInfoPayload(payload: string): Info_Packet {
    return JSON.parse(payload)
}

export function DeserializeKeepAlivePayload(payload: string): Keep_Alive_Packet {
    return JSON.parse(payload)
}
