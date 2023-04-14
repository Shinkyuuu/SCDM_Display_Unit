import React, { Component, Fragment } from "react";
// import { useNavigate } from "react-router-dom";
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
        setVolume: 4
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
                duration: 500,
                value: "0"
            },
            {
                duration: 1000,
                value: "1"
            }
            ],

            easing: "linear",
            loop: true,
            delay: (el, i) => 30 * i
        });

        this.volumeSlider = document.querySelector('.volumeSlider');
        this.sliderRange = document.querySelector('.sliderRange');
        this.sliderPath = document.querySelector('.sliderPath');
        this.basePath = "M0,480 l320,0 l0,480 l-320,0 Z"
        this.mouseY = 0;
        this.mouseInitialY = 0;
        this.mouseDy = 0;
        this.mouseDyFactor = 1;
        this.minVol = parseInt(this.sliderRange.min);
        this.maxVol = parseInt(this.sliderRange.max);
        this.currVol = parseInt(this.sliderRange.value);
        this.volHeight = this.volumeSlider.offsetHeight;
        this.volSliderY = this.volHeight * this.currVol / this.maxVol;
        this.minVolSliderY = this.volHeight * this.minVol / this.maxVol;
        this.maxVolSliderY = this.volHeight * this.maxVol / this.maxVol;
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
        this.currVol = parseInt(this.volSliderY * this.maxVol / this.volHeight);
        this.sliderRange.value = this.currVol;

        // console.log("newSliderY = " + this.volSliderY);
            
        this.newPath = "M0," + (this.volHeight - this.volSliderY) + 
            " l" + this.volumeSlider.offsetWidth + ",0" + 
            " l0," + this.volumeSlider.offsetHeight + 
            " l-" + this.volumeSlider.offsetWidth + ",0 Z";

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
            // console.log("volSliderY = " + this.volSliderY);
            // console.log("mouseY = " + this.mouseY);
            // console.log("pageY = " + this.pageY);
            this.newY = this.volSliderY + this.mouseY - this.pageY;
            // console.log("newY = " + this.newY);
            // console.log("minRange, maxRange = " + this.minVolSliderY + " " + this.maxVolSliderY);

            if (this.newY >= this.minVolSliderY && this.newY <= this.maxVolSliderY) {
                this.volSliderY = this.newY;
                this.mouseY = this.pageY;
            } else {
                this.volSliderY = this.newY < this.minVolSliderY ? this.minVolSliderY : this.maxVolSliderY;
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
        this.mouseY = 0;
    };
    
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
                <div className = "deviceContainer">
                    <div className = "deviceIcon">

                    </div>
                    <p className = "deviceName">
                        Cody's Galaxy
                    </p>
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

                    <svg className = "sliderBar" width="100px" height="80vh" >
                        <g>
                            <path class="sliderPath" d= { this.basePath }>
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
