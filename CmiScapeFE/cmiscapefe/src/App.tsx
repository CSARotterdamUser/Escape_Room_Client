import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import './App.css';
import {AuthLoginResponse, GroupJoinResponse, UserLoggedIn} from "./components/ApiModels";
import {checkAuthIsValid} from "./components/Persistence";
import LoginComponent from "./components/Login/LoginComponent";
import LobbyComponent from "./components/Lobby/LobbyComponent";
import GameComponent from "./components/Game/GameComponent";
import IntroComponent from "./components/Intro/IntroComponent";
import {RoomPacket} from "./Socket/Packets";

interface AppState {
    userloggedin: UserLoggedIn
    user: AuthLoginResponse | undefined
    group: GroupJoinResponse | undefined
    roomPacket: RoomPacket | undefined
    socket: WebSocket | undefined
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props)
        this.state = {
            userloggedin: {
                loggedIn: false,
            },
            user: undefined,
            group: undefined,
            roomPacket: undefined,
            socket: undefined

        }
    }

    componentDidMount() {
        console.log("Main app loaded")
        this.updateAuth()
    }

    private updateAuth = async () => {
        this.setState({userloggedin: await checkAuthIsValid()})
    }

    private updateUser = (data: AuthLoginResponse) => {
        this.setState({user: data})
    }

    private updateGroup = (data: GroupJoinResponse | undefined) => {
        this.setState({group: data})
    }

    private updateRoomPacket = (data: RoomPacket) => {
        this.setState({roomPacket: data})
    }

    private updateSocket = (data: WebSocket) => {
        this.setState({socket: data})
    }

    public render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        {/*<HomeComponent user={checkAuthIsValid}/>*/}
                        <IntroComponent/>
                    </Route>
                    <div className="page-container">
                        <div className="header">
                            <p>CAPS</p> <p className="hidden-data-field">72</p> <p>CMYK</p> <p className="hidden-data-field">48</p> <p>JMDR</p> <p className="hidden-data-field">74</p> <p>YMCA</p> <p className="hidden-data-field">7A</p> <p>BRUH</p> <p className="hidden-data-field">65</p>
                        </div>
                        <div className="header white">
                            <p className="titletab"> >>> Cmi/Scape.c.main();</p>
                            <p>V.0.1.3658754</p>
                        </div>
                        <div className="content-wrap">


                            <Route path="/login" exact>
                                <LoginComponent updateAuth={this.updateAuth} updateUser={this.updateUser}/>
                            </Route>
                            <Route path="/lobby" exact>
                                <LobbyComponent user={this.state.user} group={this.state.group}
                                                updateUser={this.updateUser}
                                                updateGroup={this.updateGroup}
                                                updateRoom ={this.updateRoomPacket}
                                                updateSocket={this.updateSocket}/>
                            </Route>
                            <Route path="/play" exact>
                                {this.state.user !== undefined && this.state.group !== undefined && this.state.roomPacket !== undefined && this.state.socket !== undefined
                                    ? <GameComponent user={this.state.user} group={this.state.group} room={this.state.roomPacket} socket={this.state.socket}/> :
                                    <Redirect to={"/lobby"}/>}
                            </Route>
                            {this.state.user !== undefined && this.state.group !== undefined && this.state.roomPacket !== undefined && this.state.socket !== undefined
                                ? <Redirect to="/play"/>
                                : undefined}
                        </div>
                        <br/>

                    </div>
                </Switch>
            </BrowserRouter>

        )
    }

};
