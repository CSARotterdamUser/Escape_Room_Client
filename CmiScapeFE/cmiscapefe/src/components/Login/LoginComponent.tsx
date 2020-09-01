import React from 'react'
import '.././Form.css'
import './Login.css'
import {Redirect} from 'react-router'
import {authLoginRequest} from '../Requests'
import {AuthLoginResponse, UserLoggedIn} from '../ApiModels';
import {isString} from "../Helper";
import {saveAuth} from "../Persistence";
import RegisterComponent from "./RegisterComponent";

interface LoginProps {
    updateAuth: () => void
    updateUser: (data: AuthLoginResponse) => void
}

interface LoginState {
    mail: string
    password: string
    loggingIn: boolean
    user: UserLoggedIn
    errorMessage: string | null
    tabSelected: "Info" | "Login" | "Register"
}

export default class LoginComponent extends React.Component<LoginProps, LoginState> {
    constructor(props: any) {
        super(props)
        this.state = {
            mail: "",
            password: "",
            loggingIn: false,
            user: {
                loggedIn: false,
            },
            errorMessage: null,
            tabSelected: "Info"
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!this.state.loggingIn) {
            this.setState({
                loggingIn: true,
                errorMessage: null
            })

            const authLoginResponse = await authLoginRequest(this.state.mail, this.state.password)
            if (!isString(authLoginResponse)) {
                if (authLoginResponse.res.successful) {
                    saveAuth(authLoginResponse)
                    this.props.updateUser(authLoginResponse)
                    this.props.updateAuth()
                    this.setState({
                        loggingIn: false,
                        user: {
                            loggedIn: true,
                        }
                    })


                } else {
                    this.setState({
                        loggingIn: false,
                        errorMessage: "ERR: " + authLoginResponse.res.message
                    })
                }
            } else {
                this.setState({
                    loggingIn: false,
                    errorMessage: "ERR: " + authLoginResponse
                })
            }
        }
    }

    public render() {
        return this.state.user.loggedIn ? (
            // TODO: change to just "/" for home later
            <Redirect to="/lobby"/>
        ) : (
            <div>
                <div className="ascii-container ">


                    <p>___________________________________________________%@@@________________________________________</p>
                    <p>___@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@___@@____________@@@@@@@@@@@@@@@@@@@@@@@@@@</p>
                    <p>___@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@___@@____________@@@@@@@@@@@@@@@@@@@@@@@@@@</p>
                    <p>___@@______________________________________________@@@@______________@@______________________@@</p>
                    <p>___@@_______________________________________________________________.@@_____________________@@@</p>
                    <p>__@@@_______________________________________________________________@@@_____________________@@&</p>
                    <p>__@@@________.@@@@@@@@@@@_______@@@@@@@@@@@@@___________@@@@@@@@______@@@@@@@@@@____________@@_</p>
                    <p>__@@______@@@@@@@@@@@@@@@@@__*@@@@@@@@@@@@@@@@_________@@@@@@@@@@_____@@@@@@@@@@@@@@________@@_</p>
                    <p>__@@____@@@@@@@__________@@__@@@@@___________@________@@@@@@@@@@@@____@@______@@@@@@________@@_</p>
                    <p>__@@___@@@@@@________________@@@@@@__________________@@@@@@__@@@@@@___@@______@@@@@@________@@__</p>
                    <p>__@@__@@@@@@@________________@@@@@@@@@@@@@@_________.@@@@@____@@@@@___@@____.@@@@@@________@@@__</p>
                    <p>_@@@__@@@@@@@___________________@@@@@@@@@@@@@@@_____@@@@@@_____@@@@___@@@@@@@@@@___________@@&__</p>
                    <p>_@@@__*@@@@@@___________________________@@@@@@@.___@@@@@@@@@@@@@@@@__@@@____@@@@@@@________@@___</p>
                    <p>_@@____@@@@@@@.___________________________@@@@@/_@@@@@@@@@@@@@@@@@@__@@@______@@@@@@#______@@___</p>
                    <p>_@@______@@@@@@@@@@@@@@@@@@__@@@@@@@@@@@@@@@@@@@@____@@__________@@__@@@_______@@@@@@@_____@@___</p>
                    <p>_@@_________@@@@@@@@@@@@@@@__@@@@@@@@@@@@@@@@__@@____@@___________@__@@@________@@@@@@@____@@___</p>
                    <p>_@@______________________________________________@@@@_____________@@@_____________________@@@___</p>
                    <p>@@@_______________________________________________________________@@@_____________________@@____</p>
                    <p>@@@_______________________________________________________________@@____@@@_______________@@____</p>
                    <p>@@________________________________________________________________@@__@@___@@_____________@@____</p>
                    <p>@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@__@@___@@@@@@@@@@@@@@@@@____</p>
                    <p>_______________________________________________________________________@@@@@____________________</p>

                    <br/>


                </div>
                <br/>
                <br/>


                <div className="form-container">

                    <div className="form-button-bar">
                        <button className="form-tab-button"
                                onClick={event => this.setState({tabSelected: "Info"})}>Algemene Info
                        </button>
                        <button className="form-tab-button"
                                onClick={event => this.setState({tabSelected: "Login"})}>Login
                        </button>
                        <button className="form-tab-button"
                                onClick={event => this.setState({tabSelected: "Register"})}>Registeren
                        </button>
                    </div>

                    <div className="form-box">

                        {this.state.tabSelected === "Login" ?
                            <form
                                className="form"
                                method="post"
                                onSubmit={this.handleSubmit}>
                                <input
                                    className="form-input"
                                    name="mail"
                                    type="email"
                                    placeholder="email"
                                    autoComplete="off"
                                    value={this.state.mail}
                                    onChange={event => this.setState({mail: event.target.value})}
                                    readOnly={this.state.loggingIn}/>
                                <input
                                    className="form-input"
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    autoComplete="off"
                                    value={this.state.password}
                                    onChange={event => this.setState({password: event.target.value})}
                                    readOnly={this.state.loggingIn}/>
                                <div className="form-submit-error-text">
                                    {this.state.errorMessage !== null ? this.state.errorMessage : ""}
                                </div>
                                <input
                                    className="form-input form-submit-button"
                                    type="submit"
                                    value={!this.state.loggingIn ? "Login" : "Inloggen..."}
                                    readOnly={this.state.loggingIn}/>
                            </form>
                            : this.state.tabSelected === "Register"
                                ? <RegisterComponent parent={this}/>
                                : <div>
                                    <p className="info-header-text">There is text here</p>
                                    <div className="info-box-text-container">
                                        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

