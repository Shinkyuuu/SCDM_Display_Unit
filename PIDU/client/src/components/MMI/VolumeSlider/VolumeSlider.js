import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import io from 'socket.io-client';

import "./VolumeSlider.css";

class VolumeSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volume : 50
        };

        this.updateValue = this.updateValue.bind(this);
    }

    changeVolumeClick(command, newVolume) {
        this.props.MMICommand(command, newVolume);
    }

    componentDidMount() {
        this.volSliderContainer = document.querySelector('.volumeSlider');
        this.sliderRange = document.querySelector('.sliderRange');
        this.sliderPath = document.querySelector('.sliderPath');
        this.basePath = "M0,480 l320,0 l0,480 l-320,0 Z"
        this.mouseY = 0;
        this.minVol = parseInt(this.sliderRange.min);
        this.maxVol = parseInt(this.sliderRange.max);
        this.currVol = parseInt(this.sliderRange.value);
        this.volHeight = this.volSliderContainer.offsetHeight;
        this.volSliderY = this.volHeight * this.currVol / this.maxVol;
        this.minVolSliderY = this.volHeight * this.minVol / this.maxVol;
        this.maxVolSliderY = this.volHeight * this.maxVol / this.maxVol;
        this.newPath = 0;
        this.newY = 0;
        this.pageY = 0;
        
        this.serverUpdateValue(this.state.volume);

        this.socket = io("http://localhost:3001", {
            withCredentials: false,
            closeOnBeforeunload: false
        });

        this.socket.on("test", (newVol) => {
            let parsedVol = Math.floor((parseInt(newVol) * 100) / 127).toString();
            this.serverUpdateValue(parsedVol);
        });

    }  

    componentWillUnmount() {
        this.socket.disconnect();
    }

    serverUpdateValue(vol) {
        this.volSliderY = parseInt(vol * this.volHeight / this.maxVol);

        this.updateValue(vol);
    }

    updateValue(vol) {
        this.setState({
            volume: vol
        });

        console.debug("Volume: " + vol);

        
        this.newPath = "M0," + (this.volHeight - this.volSliderY) + 
            " l" + this.volSliderContainer.offsetWidth + ",0" + 
            " l0," + this.volSliderContainer.offsetHeight + 
            " l-" + this.volSliderContainer.offsetWidth + ",0 Z";

        this.sliderPath.setAttribute('d', this.newPath);
    }

    mouseDown(e) {
        this.mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
    }

    mouseMove(e) {
        if (this.mouseY) {
            this.pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
            this.newY = this.volSliderY + this.mouseY - this.pageY;

            if (this.newY >= this.minVolSliderY && this.newY <= this.maxVolSliderY) {
                this.volSliderY = this.newY;
                this.mouseY = this.pageY;
            } else {
                this.volSliderY = this.newY < this.minVolSliderY ? this.minVolSliderY : this.maxVolSliderY;
            }

            this.updateValue(parseInt(this.volSliderY * this.maxVol / this.volHeight));
        }
    };

    mouseUp() {
        if (this.mouseY) {
            let encodedVol = (this.state.volume * 127) / 100;
            this.changeVolumeClick(4, encodedVol); // TODO: Also Send the currVol
        }

        this.mouseY = 0;

    };

    render() {
        return (
            <Fragment>
                <div className = "volumeSlider"
                    onMouseDown = { (event) => this.mouseDown(event) }
                    onTouchStart = { (event) => this.mouseDown(event) }
                    onMouseMove = { (event) => this.mouseMove(event) }
                    onTouchMove = { (event) => this.mouseMove(event) }
                    onMouseUp = { () => this.mouseUp() } 
                    onMouseLeave = { () => this.mouseUp() }
                    onTouchEnd = { () => this.mouseUp() }>

                    <input className = "sliderRange" 
                        type = "range" 
                        min = "0" 
                        max = "100" 
                        value = { this.state.volume }/>

                    <svg className = "sliderBar" width="100px" height="80vh" >
                        <g>
                            <path className = "sliderPath"/>
                        </g>
                    </svg>

                    <img className = "sound-icon" draggable="false" src="https://i.imgur.com/peHsNzR.png"></img>
                </div>
            </Fragment>
        );
    };
};

export default VolumeSlider;
