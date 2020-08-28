import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './App.css';
import {AuthLoginResponse, GroupJoinResponse, UserLoggedIn} from "./components/ApiModels";
import {checkAuthIsValid} from "./components/Persistence";
import LoginComponent from "./components/Login/LoginComponent";
import LobbyComponent from "./components/Lobby/LobbyComponent";
import HomeComponent from "./components/Home/HomeComponent";

interface AppState {
    userloggedin: UserLoggedIn
    user: AuthLoginResponse | undefined
    group: GroupJoinResponse | undefined
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props)
        this.state = {
            userloggedin: {
                loggedIn: false,
                role: null
            },
            user: undefined,
            group: undefined
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

    private updateGroup = (data: GroupJoinResponse) => {
        this.setState({group: data})
    }

    public render() {
        return (
            <BrowserRouter>

                <div className="page-container">
                    <div className="header">
                        <p>CAPS</p> <p>BLK</p> <p>CMI</p> <p>JMDR</p>
                    </div>
                    <div className="header white">
                        <p>V.0.1.3658754</p>
                    </div>
                    <div className="content-wrap">
                        <Switch>
                            <Route path="/" exact>
                                <HomeComponent user={checkAuthIsValid}/>
                            </Route>
                            <Route path="/login" exact>
                                <LoginComponent updateAuth={this.updateAuth} updateUser={this.updateUser}/>
                            </Route>
                            <Route path="/lobby" exact>
                                <LobbyComponent user={this.state.user} group={this.state.group} updateUser={this.updateUser} updateGroup={this.updateGroup}/>
                            </Route>
                        </Switch>
                    </div>
                    <br/>

                </div>
            </BrowserRouter>

        )
    }

};
