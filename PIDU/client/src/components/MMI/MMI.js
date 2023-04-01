import React, { Component, useSyncExternalStore, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./MMI.css";
import logo from "./logo.png";
import axios from 'axios';
import anime from 'animejs/lib/anime.es.js';

/**
 * 
 * @returns MMI Fragment
 */
class MMI extends Component {
    isPaused = true;

    // const navigate = useNavigate();

    // User Bluetooth Commands
    commands = {
        playPause: 0,
        skipForward: 1,
        skipBackward: 2,
        pair: 3,
        volumeUp: 4,
        volumeDown: 5
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

    // Relay Bluetooth command to the Server 
    MMICommand(command) {

        axios.post(`/cmd`, { opCode : Number(command)})
        .then(res => { console.log(res); console.log(res.data); });
    };

    // anime({
    //     targets: [".BackgroundHolder .star"],
    //     opacity: [
    //       {
    //         duration: 1000,
    //         value: "0"
    //       },
    //       {
    //         duration: 5000,
    //         value: "1"
    //       }
    //     ],

    //     easing: "linear",
    //     loop: true,
    //     delay: (el, i) => 50 * i
    //   });

    randomRadius() {
        return Math.random() * 0.7 + 0.6;
    };

    getRandomX() {
        return Math.floor(Math.random() * Math.floor(window.innerWidth)).toString();
    };

    getRandomY() {
        return Math.floor(Math.random() * Math.floor(window.innerHeight)).toString();
    };
    
    render() {
        return (
            <Fragment>
                <div className = "Header">
                    <img className = "logo" src = {logo}/>
                </div>

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
                                <g>
                                <path className = "PPSymbol PPRight" d="M50,50 L50,150 L136.6,100 Z" />
                                </g>
                            </svg>
                        </div>
                    </button>
                    <button id = "skipForwardBtn" onClick={() => this.skipForwardClick(this.commands.skipForward)}> Skip Forward</button>
                </div>

                <svg className = "BackgroundHolder">
                    {[...Array(70)].map(() => (
                        <circle
                        cx={this.getRandomX()}
                        cy={this.getRandomY()}
                        r={this.randomRadius()}
                        stroke="none"
                        strokeWidth="0"
                        fill="white"
                        className="star"
                        />
                    ))}
                </svg>
            </Fragment>        
        );
    };
};

export default MMI;
