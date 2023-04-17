import React, { Component, useContext, Fragment } from "react";
import "./MMI.css";
import logo from "./assets/logo.png";
import axios from 'axios';
import anime from 'animejs/lib/anime.es.js';
import StarrySky from "./StarrySky/StarrySky.js";
import ConnectedDevice from "./ConnectedDevice/ConnectedDevice.js";
import VolumeSlider from "./VolumeSlider/VolumeSlider.js";
import io from 'socket.io-client';
/**
 * 
 * @returns MMI Fragment
 */
class MMI extends Component {

    isPaused = true;

    // User Bluetooth Commands
    commands = {
        playPause: 0,
        skipForward: 1,
        skipBackward: 2,
        pair: 3,
        setVolume: 4
    }

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.socket = io("http://localhost:3001", {
            withCredentials: false,
            closeOnBeforeunload: false
        });

        this.socket.emit("start");

        this.socket.on("test", (testData) => {

        });

        // this.socket.on("start")      
    }

    componentWillUnmount() {
        this.socket.disconnect()
    }

    playPauseClick(command) {
        anime({
            targets: '#playPauseBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });

        if (this.isPaused) {
            anime({
                targets: '.PPLeft',
                d: [
                  { value: "M50,50 L50,150 L136.6,100 Z" }, { value: "M50,50 L50,150 L50,100 Z" }
                ],
                easing: 'cubicBezier(.5, .05, .1, .3)',
                duration: 500
              });
              
            anime({
                targets: '.PPRight',
                d: [
                    { value: "M50,50 L50,150 L136.6,100 Z" }, { value: "M136.6,50 L136.6,150 L136.6,100 Z" }
                ],
                easing: 'cubicBezier(.5, .05, .1, .3)',
                duration: 500
            });
    
        } else {
            anime({
                targets: '.PPLeft',
                d: [
                    { value: "M50,50 L50,150 L50,100 Z" }, { value: "M50,50 L50,150 L136.6,100 Z" }
                ],
                easing: 'cubicBezier(.5, .05, .1, .3)',
                duration: 500
              });
              
            anime({
                targets: '.PPRight',
                d: [
                    { value: "M136.6,50 L136.6,150 L136.6,100 Z" }, { value: "M50,50 L50,150 L136.6,100 Z" }
                ],
                easing: 'cubicBezier(.5, .05, .1, .3)',
                duration: 500
            });    
        }

        this.isPaused = !this.isPaused;

        this.MMICommand(command);
    };

    skipForwardClick(command) {
        anime({
            targets: '#skipForwardBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });

        this.MMICommand(command);
    }

    skipBackwardClick(command) {
        anime({
            targets: '#skipBackwardBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });
        
        this.MMICommand(command);
    }

    pairDeviceClick(command) {
        this.MMICommand(command);
    }



    MMICommand(command, parameter = null) {
        console.debug("Sending HTTP Command: " + command);
        axios.post(`/cmd`, { 
            opCode : Number(command),
            parameter : parameter
        })
        .then(res => { console.log(res); console.log(res.data); });
    }

    render() {
        return (
            <Fragment>
                <div className = "Header">
                    <img className = "logo" src = {logo}/>
                </div>
                <div className = "contentContainer">
                    <div className = "MMIContainer">
                        <button id = "skipBackwardBtn" className = "skipBtn" onClick={() => this.skipBackwardClick(this.commands.skipBackward)}> 
                            <svg className = "SContainer" width="230px" height="200px">
                                <g>
                                    <path className = "SSymbol" d="M50,50 L50,150 Z" />
                                    <path className = "SSymbol" d="M180,50 L180,150 L93.4,100 Z" />
                                </g>
                            </svg>
                        </button>
                        <button id = "playPauseBtn" onClick={() => this.playPauseClick(this.commands.playPause)}>
                            <div className = "PPContainer">
                                <svg width="200px" height="200px">
                                    <g>
                                        <path className = "PPSymbol PPLeft" d="M50,50 L50,150 L136.6,100 Z" />
                                    </g>
                                </svg>
                            </div>
                            <div className = "PPContainer">
                                <svg width="200px" height="200px">
                                    <path className = "PPSymbol PPRight" d="M50,50 L50,150 L136.6,100 Z" />8:(ZA)
                                </svg>
                            </div>
                        </button>
                        <button id = "skipForwardBtn" className = "skipBtn" onClick={() => this.skipForwardClick(this.commands.skipForward)}> 
                            <svg className = "SContainer" width="230px" height="200px">
                                <g>
                                    <path className = "SSymbol" d="M50,50 L50,150 L136.6,100 Z" />
                                    <path className = "SSymbol" d="M180,50 L180,150  Z" />
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className = "songContainer">
                    <p className = "songName">
                        This is my Song
                    </p>
                    <p className = "artistName">
                        Cody Park
                    </p>
                </div>

                <ConnectedDevice MMICommand = { this.MMICommand } />
                
                <VolumeSlider MMICommand = { this.MMICommand } />
                <StarrySky />

            </Fragment>        
        );
    };
};

export default MMI;
