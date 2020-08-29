import React from "react";
import './Lobby.css'
import './JoinGroup.css'
import {
    ActionType,
    AuthLoginResponse,
    AuthWhoAmIResponse,
    GroupJoinResponse,
    ServiceResponse,
    UserLoggedIn
} from "../ApiModels";
import JoinGroupComponent from "./JoinGroupComponent";
import PreGameComponent from "./PreGameComponent";
import {authWhoAmIRequest, readGroupRequest} from "../Requests";
import {isString} from "../Helper";
import {checkAuthIsValid, clearAuth} from "../Persistence";
import {Redirect} from "react-router";
import {RoomPacket} from "../../Socket/Packets";

interface LobbyProps {
    user: AuthLoginResponse | undefined
    group: GroupJoinResponse | undefined
    updateUser: (data: AuthLoginResponse) => void
    updateGroup: (data: GroupJoinResponse) => void
    updateRoom: (data: RoomPacket) => void
    updateSocket: (data: WebSocket) => void
}

interface LobbyState {
    group: GroupJoinResponse | undefined
    user: AuthLoginResponse | undefined
    loggedIn: UserLoggedIn | undefined

}

export default class LobbyComponent extends React.Component<LobbyProps, LobbyState> {
    private _isMounted: boolean;
    constructor(props: any) {
        super(props);
        this.state = {
            user: this.props.user,
            group: this.props.group,
            loggedIn : undefined
        }

        this.updateGroup = this.updateGroup.bind(this)
        this.updateUser = this.updateUser.bind(this)

        this._isMounted = false;

    }

    async componentDidMount() {
        this._isMounted = true;
        this._isMounted && await this.getUser();
        if(this.state.user !== undefined) {
           this._isMounted && await this.fetchGroup(this.state.user.user.group, this.state.user.res.outcome)
        }
    }

    private updateGroup(data: GroupJoinResponse) {
        this.setState({group: data})
        this.props.updateGroup(data)
    }

    private updateUser(data: AuthLoginResponse) {
        this.setState({user: data})
        this.props.updateUser(data);
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    private async fetchGroup(GroupID: number | undefined, token: string | undefined) {
        if (GroupID !== undefined && token !== undefined) {
            const ReadGroupRequest = await readGroupRequest(GroupID, token)
            if (!isString(ReadGroupRequest)) {
                if (ReadGroupRequest.successful) {
                    this.updateGroup(ReadGroupRequest.outcome)
                } else {

                    console.log(ReadGroupRequest.message)

                }
            } else {

                console.log("ERR: " + ReadGroupRequest)

            }
        }
    }


    public render() {
        return (
            this.state.loggedIn !== undefined && !this.state.loggedIn.loggedIn
                ? <Redirect to="/login"/>
                : this.state.user === undefined
                ? <div className="console-window">
                    <p>Loading...</p>
                </div>
                : <div>
                    <p className="welcome-text">Welcome, {this.state.user.user.userName}</p>
                    <div className="join-group-container">
                        {this.state.user.user.group === -1 ?
                            <JoinGroupComponent user={this.state.user} updateUser={this.updateUser}
                                                updateGroup={this.updateGroup}/> : undefined}

                        {this.state.user.user.group === -1 ?
                            <p className="pregame-text">You need to join/create a group before you're able to start a
                                game</p> : undefined}
                        {this.state.group !== undefined ?
                            <PreGameComponent
                                group={this.state.group}
                                user={this.state.user}
                                updateUser={this.updateUser}
                                updateGroup={this.updateGroup}
                                updateRoom={this.props.updateRoom}
                                updateSocket={this.props.updateSocket}
                            />
                            : undefined}
                    </div>
                </div>)


    }

    private async getUser() {
        const islogged = (await checkAuthIsValid()).loggedIn
        if (islogged) {
            const token = localStorage.getItem("token")
            if (token !== null) {
                const res: AuthWhoAmIResponse | string = await authWhoAmIRequest(token)
                const validAuth: boolean = !isString(res)
                if (!validAuth) {
                    clearAuth()
                }
                const service : ServiceResponse<string> = ({
                    outcome: token,
                    successful: true,
                    message: "",
                    actionType : ActionType.INFO,
                    status: 200})

                if(!isString(res)){
                    if(res.successful){
                        this.setState({user: {res: service, user: res.outcome}})
                    }
                }

            } else {
                this.setState({loggedIn: {loggedIn: false, role: null}})
            }
        } else {
            this.setState({loggedIn: {loggedIn: false, role: null}})
        }

    }
}