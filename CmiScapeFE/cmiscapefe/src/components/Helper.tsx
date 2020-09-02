import {
    Connection_Closed_Packet, DialogueNodePacket, Group_Changed_Packet,
    Group_Update_Packet, Info_Packet,
    Keep_Alive_Packet,
    Room_Packet,
    Typed_Packet
} from "../Socket/Packets";

export function isString(arg: any): arg is string {
    return typeof arg === 'string'
}

export function isDialoguePacket(arg: any): arg is DialogueNodePacket{
    return typeof arg === 'string' ?  false
    : arg === undefined ? false
            :('NextDialogueText' in arg && "OptionText" in arg && "FunctionID" in arg)
}

export function instanceOfConnClosed(object: Typed_Packet): object is Connection_Closed_Packet {
    return object.discriminator === 'CONN-CLOSED';
}

export function instanceOfGroupChange(object: Typed_Packet): object is Group_Changed_Packet {
    return object.discriminator === 'GROUP-CHANGED-PACKET';
}

export function instanceOfRoomPacket(object: Typed_Packet): object is Room_Packet {
    return object.discriminator === 'ROOM-PACKET';
}

export function instanceOfKeepAlive(object: Typed_Packet): object is Keep_Alive_Packet {
    return object.discriminator === 'KEEP-ALIVE';
}

export function instanceOfGroupUpdate(object: Typed_Packet): object is Group_Update_Packet {
    return object.discriminator === 'GROUP-UPDATE';
}

export function instanceOfInfoPacket(object: Typed_Packet): object is Info_Packet {
    return object.discriminator === 'INFO-PACKET';
}

export function toNumberOrUndefined(value: number) {
    return isNaN(value) ? undefined : value
}

export function toNumberOrNull(value: number) {
    return toNumberOrUndefined(value) === undefined ? null : value
}

export function toNumber(value: number) {
    const v = toNumberOrUndefined(value)
    return v === undefined ? 0 : v
}

export function toUndefinedIfNull(value: Typed_Packet) {
    return value === null ? undefined : value
}