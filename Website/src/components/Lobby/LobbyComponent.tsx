import React from "react";
import './Lobby.css'
import './JoinGroup.css'
import {AuthLoginResponse, GroupJoinResponse, ServiceResponse} from "../ApiModels";
import JoinGroupComponent from "./JoinGroupComponent";
import PreGameComponent from "./PreGameComponent";
import {joinGroupRequest, readGroupRequest} from "../Requests";
import {isString} from "../Helper";

interface LobbyProps {
    user: AuthLoginResponse | undefined
    group: GroupJoinResponse | undefined
    updateUser: (data: AuthLoginResponse) => void
    updateGroup: (data: GroupJoinResponse) => void
}

interface LobbyState {
    group: GroupJoinResponse | undefined
    user: AuthLoginResponse | undefined

}

export default class LobbyComponent extends React.Component<LobbyProps, LobbyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: this.props.user,
            group: this.props.group
        }

    }

    async componentDidMount() {
        await this.fetchGroup(this.props.user?.user.group, this.props.user?.res.outcome)
    }

    private updateGroup(data: GroupJoinResponse) {
        this.setState({group: data})
        this.props.updateGroup(data)
    }

    private updateUser(data: AuthLoginResponse) {
        this.setState({user: data})
        this.props.updateUser(data);
    }

    private async fetchGroup(GroupID: number | undefined, token: string | undefined) {
        if(GroupID != undefined && token != undefined) {
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
        console.log(this.state.group)
        return (

            this.props.user == undefined ?
                <div className="console-window">
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                    <p>Something has gone horribly wrong</p>
                </div>
                : <div>
                    <p>Welcome, {this.props.user.user.userName}</p>
                    <div className="join-group-container">
                        {this.props.user?.user.group == -1 ?
                            <JoinGroupComponent user={this.props.user} updateUser={this.updateUser}
                                                updateGroup={this.updateGroup}/> : undefined}

                        {this.props.user?.user.group == -1 ?
                            <p className="pregame-text">You need to join/create a group before you're able to start a
                                game</p> : undefined}
                        {this.state.group != undefined && this.state.user != undefined ?
                            <PreGameComponent group={this.state.group} user={this.state.user}/> : undefined}
                    </div>
                </div>)


    }
}