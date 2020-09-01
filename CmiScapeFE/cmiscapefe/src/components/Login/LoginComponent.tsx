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
                                    <p className="info-header-text">Welkom bij CMI/Scape !</p>
                                    <div className="info-box-text-container">
                                        <p>LEES DE ONDERSTAANDE TEKST NOG GOED DOOR !!!
                                            De online adventure game door CMI studenten voor CMI studenten.
                                            Maak een account aan op het register tabje en log in.
                                            Je zal dan een scherm zien waar je een groep kan maken of joinen.
                                            Laat de groepsleider van de groep waar je door je SLC'er bent ingedeeld de groep maken.
                                            Deze ziet dan een code waarmee jullie de groep in kunnen. Wanneer iedereen klaar is, druk op start game, en de game zal beginnen.
                                            Je hele groep speelt in dezelfde wereld. Alles wat jullie doen heeft dus invloed op elkaar.
                                            Hou de communicatie er goed in, en ga met zn allen in een MS Teams of discord call zitten.
                                            Het spel wordt gespeeld door commands in te voeren in de input box. Er zijn 4 soorten objecten waar je commands op uit kan voeren: </p>
                                    <table >
                                        <tr>
                                        <th>Soort object</th>
                                        <th colSpan={2}>Commands</th>
                                        </tr>
                                        <tr>
                                            <td>POI</td>
                                            <td>Interact</td>
                                            <td>Examine</td>
                                        </tr>
                                        <tr>
                                            <td>Traversable</td>
                                            <td>Interact</td>
                                            <td>Examine</td>
                                        </tr>
                                        <tr>
                                            <td>Item</td>
                                            <td>Pickup</td>
                                            <td>Examine</td>
                                        </tr>
                                        <tr>
                                            <td>Inventory</td>
                                            <td>Drop</td>
                                            <td>Examine</td>
                                        </tr>
                                    </table>
                                        <p>Pluis alles uit, en probeer er zo achter te komen wat er aan de hand is op Wijnhaven.
                                            Kom je ergens niet uit of denk je een bug gevonden te hebben?
                                            Er zijn CSAR leden beschikbaar in de INF discord server voor support :  https://discord.gg/YfWVpNE</p>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

