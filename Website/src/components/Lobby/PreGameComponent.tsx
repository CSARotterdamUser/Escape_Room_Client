import React from "react";
import {AuthLoginResponse, ConnectInfo, GroupJoinResponse, ServiceResponse} from "../ApiModels";
import './PreGame.css'
import {joinGroupRequest, kickPlayerRequest, openWebSocketRequest, startGameRequest} from "../Requests";
import {
    instanceOfConnClosed,
    instanceOfGroupUpdate,
    instanceOfInfoPacket,
    instanceOfKeepAlive, instanceOfRoomPacket,
    isString
} from "../Helper";
import {Redirect} from "react-router";
import {
    Connection_Closed_Packet,
    DeserializePacket,
    Group_Update_Packet,
    Info_Packet, Keep_Alive_Packet, ReadySocket, Room_Packet,
    RoomPacket
} from "../../Socket/Packets";
import {SOCKET_URL} from "../Global";

interface PreGameProps {
    user: AuthLoginResponse
    group: GroupJoinResponse
    updateUser: (data: AuthLoginResponse) => void
    updateGroup: (data: GroupJoinResponse) => void
    updateRoom: (data: RoomPacket) => void
    updateSocket: (data: WebSocket) => void
}

export interface PreGameState {
    group: GroupJoinResponse
    user: AuthLoginResponse
    connect: ConnectInfo | undefined
    room: RoomPacket | undefined
    startGameErrorMessage: string
    socket: WebSocket | undefined
    gameStarted: boolean
    readyPlayers: Array<ReadySocket>
}


export default class PreGameComponent extends React.Component<PreGameProps, PreGameState> {
    constructor(props: any) {
        super(props);

        this.state = {
            group: this.props.group,
            user: this.props.user,
            readyPlayers: new Array<ReadySocket>(),
            room: undefined,
            connect: undefined,
            startGameErrorMessage: "",
            socket: undefined,
            gameStarted: false
        }


        this.handleMessage = this.handleMessage.bind(this)
        this.updateReady = this.updateReady.bind(this)
    }


    async componentDidMount() {
        const connect: ServiceResponse<ConnectInfo> | string = await openWebSocketRequest(this.props.user.res.outcome, this.props.group.groupID);

        if (!isString(connect)) {
            if (connect.successful) {
                this.setState({socket: new WebSocket(`${SOCKET_URL}/socket/${this.props.user.user.playerID}`)})

                if (this.state.socket !== undefined) {

                    this.state.socket.onopen = (event: Event) => {
                        this.state.socket?.send(this.props.user.res.outcome);
                    }

                    this.state.socket.onmessage = (event: MessageEvent) => {
                        console.log(event)
                        this.handleMessage(event)
                    }
                }

            } else {
                this.setState({startGameErrorMessage: connect.message})
            }
        } else {
            this.setState({startGameErrorMessage: connect})
        }
    }

    private handleMessage(event: MessageEvent) {
        if (isString(event.data)) {

            const res = DeserializePacket(event.data);

            if (res !== undefined) {
                instanceOfConnClosed(res) ? this.handleConnClosed(res)
                    : instanceOfGroupUpdate(res) ? this.handleGroupUpdate(res)
                    : instanceOfInfoPacket(res) ? this.handleInfoPacket(res)
                        : instanceOfKeepAlive(res) ? this.handleKeepAlive()
                            : instanceOfRoomPacket(res) ? this.handleRoomPacket(res)
                                : console.log(res)
            }
        } else {

        }
    }

    private handleConnClosed(packet: Connection_Closed_Packet) {
    }

    private handleGroupUpdate(packet: Group_Update_Packet) {
        this.setState({readyPlayers: packet.Payload.ReadySockets})
    }

    private handleInfoPacket(packet: Info_Packet) {
    }

    private handleRoomPacket(packet: Room_Packet) {
        console.log(packet)
        this.setState({room: packet.packet})
    }

    private handleKeepAlive() {
        if (this.state.socket !== undefined)
            this.state.socket.send("Alive")
    }

    public updateReady = (ready: Array<ReadySocket>) => {
        this.setState({readyPlayers: ready})

    }

    private async KickPlayer(id: number) {
        var kickPlayerResponse = await kickPlayerRequest(id, this.props.group.groupID, this.props.user.res.outcome)

        if (!isString(kickPlayerResponse)) {
            if (kickPlayerResponse.successful) {
                this.setState({
                    group: kickPlayerResponse.outcome
                });
            } else {

                console.log(kickPlayerResponse.message)

            }
        } else {

            console.log("ERR: " + kickPlayerResponse)

        }
    }

    private async StartGame() {
        await startGameRequest(this.props.user.res.outcome)

        this.props.updateUser(this.state.user)
        this.props.updateGroup(this.state.group)
        if(this.state.socket !== undefined) {
            this.props.updateSocket(this.state.socket)
        }

        if(this.state.room !== undefined) {
            this.props.updateRoom(this.state.room)

        }
    }

    public render() {
        return (<div className="lobby-container">
            <div className="lobby-text-container">
                <p>Your Group</p>
                <p className="text-right">Online Now</p>
            </div>
            <div className="containers-wont-behave-container">
                <div className="static-group-info-container">


                    {this.state.group !== undefined && this.state.group.members !== undefined ? this.state.group.members.map(
                        member =>
                            <div className="static-group-member-container">
                                <div>{member.userName}</div>
                                {(this.state.user.user.id === member.id && this.state.group.members.length > 1) ?
                                    <button className="leave-group-button">Leave
                                        Group</button> : (this.state.group.leaderID === this.state.user.user.id) ?
                                        <button className="kicked-in-the-nuts-with-the-fury-of-a-thousand-suns button"
                                                onClick={(event => this.KickPlayer(member.id,))}>Kick
                                            Member</button> : undefined}
                            </div>) : undefined
                    }

                    {this.state.group.members.length === 1 ?
                        <button className="delete-group-button button">Delete group</button> : undefined}
                </div>

                <div className="connected-group-info-container">
                    {this.state.group.members.map(
                        member =>
                            <div className="connected-group-member-container" key={member.id}>
                                <div>{member.userName}</div>

                                {this.state.readyPlayers !== undefined
                                    ? member.playerID in this.state.readyPlayers
                                    ? this.state.readyPlayers.filter(ready => ready.playerID === member.playerID)
                                        ? <div className="connected-indicator">&nbsp;</div>
                                        : <div className="disconnected-indicator">&nbsp;</div>
                                    : <div className="disconnected-indicator">&nbsp;</div>
                                : undefined}
                                <div></div>
                            </div>)

                    }
                    <button onClick={event => this.StartGame()}>
                        Start Game
                    </button>
                </div>
            </div>
            {this.state.gameStarted ? <Redirect to="/play"/> : undefined}
        </div>);
    }


}