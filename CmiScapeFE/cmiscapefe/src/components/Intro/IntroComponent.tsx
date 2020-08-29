import React from "react";
import ReactPlayer from "react-player";
import {checkAuthIsValid} from "../Persistence";
import "./Intro.css"
import {Redirect} from "react-router";

interface IntroProps {

}

interface IntroState {
    playing: boolean,
    audioIsPlaying: boolean,
    volume: number,
    videoDonePlaying: boolean,
    audioDonePlaying: boolean
    authValid: boolean,
    intervalID: NodeJS.Timeout | null,
}


export function playing(prototype: HTMLVideoElement | null): boolean {
    return prototype === null ? false : (prototype.currentTime > 0 && !prototype.paused && !prototype.ended && prototype.readyState > 2);
}


export default class IntroComponent extends React.Component<IntroProps, IntroState> {
    constructor(props: any) {
        super(props)
        this.state = {
            playing: false,
            audioIsPlaying: false,
            volume: 0,
            videoDonePlaying: false,
            audioDonePlaying: false,
            authValid: false,
            intervalID: null
        }

        this.videoEnded = this.videoEnded.bind(this)
        this.audioEnded = this.audioEnded.bind(this)
        this.startPlaying = this.startPlaying.bind(this)
        this.startAudio = this.startAudio.bind(this)

    };

    async componentDidMount() {
        this.setState({authValid: (await checkAuthIsValid()).loggedIn});
    }


    videoEnded() {
        this.setState({videoDonePlaying: true})
    }

    audioEnded(){
        this.setState({audioDonePlaying: true})
    }

    startPlaying() {
        this.setState({playing: true});
        setTimeout(() => this.setState({volume: 0.5}), 200);
    }

    startAudio(){
        this.setState({audioIsPlaying: true});
    }

    componentWillUnmount() {

    }

    public render() {
        return (
            <div className="intro-video-container">
                {!this.state.playing ? <div>
                    <p>There's a button here. Press it.</p>
                    <button className="start-button" onClick={this.startPlaying}>
                    </button>
                </div> : <ReactPlayer
                    url="https://assets.csarotterdam.nl/video/pr.webm"
                    volume={this.state.volume}
                    playing={this.state.playing}
                    onReady={this.startPlaying}
                    onEnded={this.videoEnded}
                    width="99%"
                    height="99%"/>}

                {this.state.videoDonePlaying
                    ? <div>
                        <ReactPlayer
                        className="audio"
                        url={"https://assets.csarotterdam.nl/audio/Fan.mp3"}
                        volume={this.state.volume}
                        config = {{file:{forceAudio: true}}}
                        playing={this.state.audioIsPlaying}
                        width={0}
                        height={0}
                        onReady={this.startAudio}
                        onEnded={this.audioEnded}
                        autoPlay
                        /></div> : undefined}

                {this.state.audioDonePlaying
                ? this.state.authValid
                        ? <Redirect to="/lobby"/>
                        : <Redirect to="/login"/>
                : undefined}
            </div>
        )
    }
}

