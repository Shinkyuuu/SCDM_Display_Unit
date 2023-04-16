import React, { Component, Fragment } from "react";
import "./MMI.css";
import logo from "./logo.png";
import axios from 'axios';
import anime from 'animejs/lib/anime.es.js';
import StarrySky from "./StarrySky.js";
import ConnectedDevice from "./ConnectedDevice.js";
import VolumeSlider from "./VolumeSlider.js";

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



    MMICommand(command) {
        console.debug("Sending HTTP Command: " + command);
        axios.post(`/cmd`, { opCode : Number(command)})
        .then(res => { console.log(res); console.log(res.data); });
    }

    // componentDidMount() {
                     
    // }

    render() {
        return (
            <Fragment>
                <div className = "Header">
                    <img className = "logo" src = {logo}/>
                </div>
                <div className = "contentContainer">
                    <div className = "MMIContainer">
                        <button id = "skipBackwardBtn" onClick={() => this.skipBackwardClick(this.commands.skipBackward)}> Skip Backwards</button>
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
                        <button id = "skipForwardBtn" onClick={() => this.skipForwardClick(this.commands.skipForward)}> Skip Forward</button>
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
