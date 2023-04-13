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

    constructor(props) {
        super(props);

        this.updateValue = this.updateValue.bind(this);
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

    changeVolumeClick(command) {
        this.MMICommand(command);
    }

    // Relay Bluetooth command to the Server 
    MMICommand(command) {

        axios.post(`/cmd`, { opCode : Number(command)})
        .then(res => { console.log(res); console.log(res.data); });
    }

    randomRadius() {
        return Math.random() * 2.7 + 1.6;
    }

    getRandomX() {
        return Math.floor(Math.random() * Math.floor(window.innerWidth)).toString();
    }

    getRandomY() {
        return Math.floor(Math.random() * Math.floor(window.innerHeight)).toString();
    }

    componentDidMount() {
        anime({
            targets: [".BackgroundHolder .star"],
            opacity: [
            {
                duration: 3000,
                value: "0"
            },
            {
                duration: 10000,
                value: "1"
            }
            ],

            easing: "linear",
            loop: true,
            delay: (el, i) => 100 * i
        });

        this.volumeSlider = document.querySelector('.volumeSlider');
        this.sliderRange = document.querySelector('.sliderRange');
        this.sliderPath = document.querySelector('.sliderPath');
        this.mouseY = 0;
        this.mouseInitialY = 0;
        this.mouseDy = 0;
        this.mouseDyFactor = 1;
        this.minVol = parseInt(this.sliderRange.min);
        this.maxVol = parseInt(this.sliderRange.max);
        this.currVol = parseInt(this.sliderRange.value);
        this.rangeHeight = 480;
        this.currentY = this.rangeHeight * this.currVol / this.maxVol;
        this.rangeMinY = this.rangeHeight * this.minVol / this.maxVol;
        this.rangeMaxY = this.rangeHeight * this.maxVol / this.maxVol;
        this.newPath = 0;
        this.newY = 0;
        this.newSliderY = 0;
        this.lastMouseDy = 0;
        this.pageY = 0;

        // Update slider value, initially using the `input` value
        this.updateValue();                
    }

    // Function to update the slider value
    updateValue() {
        this.currVol = parseInt(this.currentY * this.maxVol / this.rangeHeight);
        this.sliderRange.value = this.currVol;

        // Some maths calc
        // if (Math.abs(mouseDy) < mouseDyLimit) {
        //     lastMouseDy = mouseDy;
        // } else {
        //     lastMouseDy = mouseDy < 0 ? -mouseDyLimit : mouseDyLimit;
        // }

        this.newSliderY = this.currentY + this.lastMouseDy / this.mouseDyFactor;
        if (this.newSliderY < this.rangeMinY || this.newSliderY > this.rangeMaxY) {
            this.newSliderY = this.newSliderY < this.rangeMinY ? this.rangeMinY : this.rangeMaxY;
        }

        // Build `path` string and update `path` elements
    
        this.newPath = "M0," + (this.rangeHeight - this.newSliderY) + " l320,0 l0,480 l-320,0 Z";
        this.sliderPath.setAttribute('d', this.newPath);
    }

    // Handle `mousedown` and `touchstart` events, saving data about mouse position
    mouseDown(e) {
        console.debug("Volume Mouse Down");
        this.mouseY = this.mouseInitialY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
    }

    // Handle `mousemove` and `touchmove` events, calculating values to morph the slider `path` and translate values properly
    mouseMove(e) {
        if (this.mouseY) {
            this.pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
            this.mouseDy = (this.pageY - this.mouseInitialY) * this.mouseDyFactor;
            this.newY = this.currentY + this.mouseY - this.pageY;
            if (this.newY >= this.rangeMinY && this.newY <= this.rangeMaxY) {
                this.currentY = this.newY;
                this.mouseY = this.pageY;
            } else {
                this.currentY = this.newY < this.rangeMinY ? this.rangeMinY : this.rangeMaxY;
            }
            // After doing maths, update the value
            this.updateValue();
        }
    };

    // Handle `mouseup`, `mouseleave` and `touchend` events
    mouseUp() {
        console.debug("Volume Mouse Up");
        console.debug("Current Volume: " + this.currVol);

        // Reset values
        this.mouseY = this.mouseDy = 0;
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
                                <path className = "PPSymbol PPRight" d="M50,50 L50,150 L136.6,100 Z" />8:(ZA)
                                </g>
                            </svg>
                        </div>
                    </button>
                    <button id = "skipForwardBtn" onClick={() => this.skipForwardClick(this.commands.skipForward)}> Skip Forward</button>
                </div>

                <div className = "volumeSlider"
                    onMouseDown = { (event) => this.mouseDown(event) }
                    onTouchStart = { (event) => this.mouseDown(event) }
                    onMouseMove = { (event) => this.mouseMove(event) }
                    onTouchMove = { (event) => this.mouseMove(event) }
                    onMouseUp = { () => this.mouseUp() } 
                    onMouseLeave = { () => this.mouseUp() }
                    onTouchEnd = { () => this.mouseUp() }>
                    <input className = "sliderRange" type="range" min="0" max="100" value="50"/>

                    <svg className = "sliderBar" width="320px" height="435px" >
                        <g>
                            <path class="sliderPath" d="M0,480 l320,0 l0,480 l-320,0 Z">
                            </path>
                        </g>
                    </svg>

                <img className = "sound-icon" draggable="false" src="https://i.imgur.com/peHsNzR.png"></img>
                </div>

                <svg className = "BackgroundHolder">
                    {[...Array(100)].map((x, y) => (
                        <circle
                        key={y}
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
