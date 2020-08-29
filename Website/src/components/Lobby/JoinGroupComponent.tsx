import React from "react";
import '../Form.css'
import './JoinGroup.css'
import {createGroupRequest, joinGroupRequest} from "../Requests";
import {isString} from "../Helper";
import {AuthLoginResponse, GroupJoinResponse} from "../ApiModels";

interface JoinGroupProps {
    user: AuthLoginResponse
    updateUser: (data: AuthLoginResponse) => void
    updateGroup: (data: GroupJoinResponse) => void
}

interface JoinGroupState {
    code: string
    checkingCode: boolean,
    errorMessageJoin: string
    errorMessageCreate: string
}

export default class JoinGroupComponent extends React.Component<JoinGroupProps, JoinGroupState> {
    constructor(props: any) {
        super(props);
        this.state = {
            code: "",
            checkingCode: false,
            errorMessageJoin: "",
            errorMessageCreate: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.CreateGroup = this.CreateGroup.bind(this)
    }

    private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!this.state.checkingCode) {
            this.setState({
                checkingCode: true,
                errorMessageJoin: ""
            })

            const joinGroupResponse = await joinGroupRequest(this.state.code, this.props.user.user.id)
            if (!isString(joinGroupResponse)) {
                if (joinGroupResponse.successful) {
                    this.setState({
                        checkingCode: false
                    })
                    this.props.user.user.group = joinGroupResponse.outcome.groupID
                    this.props.updateGroup(joinGroupResponse.outcome)
                    this.props.updateUser(this.props.user)
                } else {
                    this.setState({
                        checkingCode: false,
                        errorMessageJoin: "ERR: " + joinGroupResponse.message
                    })
                }
            } else {
                this.setState({
                    checkingCode: false,
                    errorMessageJoin: "ERR: " + joinGroupResponse
                })
            }
        }
    }

    private async CreateGroup() {

        const createGroupResponse = await createGroupRequest(this.props.user.res.outcome);
        if (!isString(createGroupResponse)) {
            if (createGroupResponse.successful) {

                this.props.user.user.group = createGroupResponse.outcome.groupID
                this.props.updateGroup(createGroupResponse.outcome)
                this.props.updateUser(this.props.user)
            } else {
                this.setState({
                    errorMessageCreate: "ERR: " + createGroupResponse.message
                })
            }
        } else {
            this.setState({
                errorMessageCreate: "ERR: " + createGroupResponse
            })
        }
    }

    public render() {
        return (
            <div>
                <div className="join-group-text">
                    <p>INSERT EXPLANATION ABOUT GROUPS HERE</p>
                </div>

                <div className="group-options-container">
                    <div className="group-container">
                        <p className="join-group-text">INSERT EXPLANATION ABOUT CREATING GROUP</p>
                        {this.state.errorMessageCreate === "" ? undefined : <p className="join-group-text">{this.state.errorMessageCreate}</p>}
                        <button className="group-button" onClick={this.CreateGroup}>CREATE GROUP</button>
                    </div>
                    <div className="group-container">
                        <p className="join-group-text">INSERT EXPLANATION ABOUT JOINING GROUP</p>
                        <form
                        onSubmit={this.handleSubmit}>
                            <input
                                className="group-code-input"
                                name="code"
                                type="text"
                                placeholder="Group Join Code"
                                maxLength={6}
                                autoComplete="off"
                                value={this.state.code}
                                onChange={event => this.setState({code: event.target.value})}
                                readOnly={this.state.checkingCode}/>
                            {this.state.errorMessageJoin === "" ? undefined : <p className="join-group-text">{this.state.errorMessageJoin}</p>}
                            <input
                                className="group-button"
                                type="submit"
                                value={!this.state.checkingCode ? "Join Groep" : "Checking Code..."}
                                readOnly={this.state.checkingCode}/>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}