import React, { Component, Fragment } from "react";
// import anime from 'animejs/lib/anime.es.js';
import "./VolumeSlider.css";
import SocketContext from '../../../context/socket/socket.js';


class VolumeSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volume : 50
        };

        this.updateValue = this.updateValue.bind(this);
    }

    // When the UI renders...
    componentDidMount() {
        this.volSliderContainer = document.querySelector('.volumeSlider');
        this.sliderPath = document.querySelector('.sliderPath');
        this.basePath = "M0,480 l320,0 l0,480 l-320,0 Z"
        this.minVol = 0;
        this.maxVol = 100;
        this.volHeight = this.volSliderContainer.offsetHeight;
        this.volSliderY = this.volHeight * this.state.volume / this.maxVol;
        this.minVolSliderY = this.volHeight * this.minVol / this.maxVol;
        this.maxVolSliderY = this.volHeight * this.maxVol / this.maxVol;
        this.mouseY = 0;
        this.newPath = 0;
        this.newY = 0;
        this.pageY = 0;
        
        this.serverUpdateValue(this.state.volume);

        this.props.socket.on("Volume_Change", (newVol) => {
            let parsedVol = Math.floor((parseInt(newVol) * 100) / 127).toString();
            this.serverUpdateValue(parsedVol);
        });
    }  

    // When the UI is about to unrender
    componentWillUnmount() {
    }

    // Handle new volume packet transmission
    changeVolumeClick(command, newVolume) {
        this.props.MMICommand(command, newVolume);
    }

    // Given the volume (in %) convert it to slider height and update slider
    serverUpdateValue(vol) {
        this.volSliderY = parseInt(vol * this.volHeight / this.maxVol);
        this.updateValue(vol);
    }

    // Given slider height,reposition slider in UI
    updateValue(vol) {
        // Update volume
        this.setState({ volume: vol }, () => {
            console.debug("Volume: " + vol);
        });


        // Render new position for slider
        this.newPath = "M0," + (this.volHeight - this.volSliderY) + 
            " l" + this.volSliderContainer.offsetWidth + ",0" + 
            " l0," + this.volSliderContainer.offsetHeight + 
            " l-" + this.volSliderContainer.offsetWidth + ",0 Z";

        this.sliderPath.setAttribute('d', this.newPath);
    }

    // get mouse Y position if the user presses on the volume bar
    mouseDown(e) {
        this.mouseY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;
    }

    // If the cursor is within the volume bar, calculate its relative position within volume bar
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

    // if the cursor is released from the volume bar, update volume
    mouseUp() {
        if (this.mouseY) {
            let encodedVol = (this.state.volume * 127) / 100;
            this.changeVolumeClick(4, encodedVol); // TODO: Also Send the currVol
        }

        this.mouseY = 0;

    };

    // Render UI
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

                    <svg className = "sliderBar" >
                        <g>
                            <path className = "sliderPath"/>
                        </g>
                    </svg>

                    <img className = "sound-icon" alt = "eighth note" draggable="false" src="https://i.imgur.com/peHsNzR.png"></img>
                </div>
            </Fragment>
        );
    };
};

const VolumeSliderWithSocket = (props) => (
    <SocketContext.Consumer>
      {socket => <VolumeSlider {...props} socket={socket} />}
    </SocketContext.Consumer>
);

export default VolumeSliderWithSocket;
