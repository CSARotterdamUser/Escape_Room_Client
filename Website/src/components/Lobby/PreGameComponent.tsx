import React from "react";
import {AuthLoginResponse, GroupJoinResponse} from "../ApiModels";
import './PreGame.css'

interface PreGameProps {
    user: AuthLoginResponse
    group: GroupJoinResponse
}


export default class PreGameComponent extends React.Component<PreGameProps, {}> {
    constructor(props: any) {
        super(props);

        console.log(this.props.group)
        console.log(this.props.group.members)
        console.log(this.props.group.leaderID)
        console.log(this.props.user)
        console.log(this.props.user.user.id)
    }

    public render() {
        return (<div>
            <div className="static-group-info-container">

                {this.props.group != undefined && this.props.group.members != undefined ? this.props.group.members.map(
                    member =>
                        <div className="static-group-member-container">
                            <div>{member.userName}</div>
                            {(this.props.user.user.id == member.id) ?
                                <button className="leave-group-button">Leave Group</button> : (this.props.group.leaderID == this.props.user.user.id) ?
                                    <button className="kicked-in-the-nuts-with-the-fury-of-a-thousand-suns button">Kick
                                        Member</button> : undefined}
                        </div>) : undefined
                }

                {this.props.group.members.length == 1 ?
                    <button className="delete-group-button button">Delete group</button> : undefined}
            </div>
            <div className="connected-group-info-container">
                {this.props.group != undefined ? this.props.group.members.map(
                    member =>
                        <div className="connected-group-member-container" key={member.id}>
                            <div>{member.userName}</div>
                            <div></div>
                        </div>) : undefined

                }
                <button>refresh</button>
                <button disabled={this.props.group?.leaderID != this.props.user?.user.id}>Start Game</button>
            </div>
        </div>);
    }
}