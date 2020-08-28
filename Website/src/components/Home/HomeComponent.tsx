import React from "react";
import {Redirect} from "react-router";
import {UserLoggedIn} from "../ApiModels";

export interface HomeProps {
    user: () => Promise<UserLoggedIn>
}

export interface HomeState {
    user: UserLoggedIn | "loading"
}

export default class HomeComponent extends React.Component<HomeProps, HomeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            user: "loading"
        }
    };

    async componentDidMount() {
        this.setState({user: await this.props.user()})
    }

    public render() {


        return this.state.user == "loading" ? (
                <p>loading</p>) :
            this.state.user.loggedIn ? (
                // TODO: change to just "/" for home later
                <Redirect to="/lobby"/>
            ) : <Redirect to="/login"/>
    }

}