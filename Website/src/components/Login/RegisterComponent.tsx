import React from "react";
import {UserLoggedIn} from "../ApiModels";
import {authLoginRequest, authRegisterRequest} from "../Requests";
import {isString} from "../Helper";
import {saveAuth} from "../Persistence";
import LoginComponent from "./LoginComponent";

interface RegisterProps {
    parent: LoginComponent
}

interface RegisterState {
    mail: string
    username: string
    password: string
    passwordConfirm: string
    registering: boolean
    errorMessage: string | null
    successfullyRegistered: boolean
}

export default class RegisterComponent extends React.Component<RegisterProps, RegisterState> {
    constructor(props: any) {
        super(props)
        this.state = {
            mail: "",
            username: "",
            password: "",
            passwordConfirm: "",
            registering: false,
            errorMessage: null,
            successfullyRegistered: false
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (this.state.password == this.state.passwordConfirm) {
            if (!this.state.registering) {
                this.setState({
                    registering: true,
                    errorMessage: null
                })

                const authRegisterResponse = await authRegisterRequest(this.state.mail, this.state.username, this.state.password)
                if (!isString(authRegisterResponse)) {
                    if (authRegisterResponse) {
                        this.setState({
                            registering: false,
                            successfullyRegistered: true
                        })
                        this.props.parent.setState({tabSelected: "Login"})

                    } else {
                        this.setState({
                            registering: false,
                            errorMessage: "ERR: The Server could not register your account"
                        })
                    }
                } else {
                    this.setState({
                        registering: false,
                        errorMessage: "ERR: " + authRegisterResponse
                    })
                }
            }
        } else {
            this.setState({errorMessage: "ERR: Passwords do not match"})
        }
    }

    public render() {
        return (<form
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
                readOnly={this.state.registering}/>
            <input
                className="form-input"
                name="username"
                type="text"
                placeholder="username"
                autoComplete="off"
                value={this.state.username}
                onChange={event => this.setState({username: event.target.value})}
                readOnly={this.state.registering}/>
            <input
                className="form-input"
                name="password"
                type="password"
                placeholder="password"
                autoComplete="off"
                value={this.state.password}
                onChange={event => this.setState({password: event.target.value})}
                readOnly={this.state.registering}/>
            <input
                className="form-input"
                name="ConfirmPassword"
                type="password"
                placeholder="Comfirm password"
                autoComplete="off"
                value={this.state.passwordConfirm}
                onChange={event => this.setState({passwordConfirm: event.target.value})}
                readOnly={this.state.registering}/>
            <div className="form-submit-error-text">
                {this.state.errorMessage !== null ? this.state.errorMessage : ""}
            </div>
            <input
                className="form-input form-submit-button"
                type="submit"
                value={!this.state.registering ? "Registreer" : "Bezig met Registreren..."}
                readOnly={this.state.registering}/>
        </form>)


    }


}