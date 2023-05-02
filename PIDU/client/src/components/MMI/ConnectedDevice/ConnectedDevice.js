import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import "./ConnectedDevice.css";
import SocketContext from '../../../context/socket/socket.js';


class ConnectedDevice extends Component {
    constructor(props) {
        super(props);
        this.numberOfBars = 4;

        this.state = {
            deviceName: "Phone"
        }
    }

    // Load bar elements
    createBars() {
        let barsContainer = document.getElementById("barsContainer");
 
        // Add bar DOMs
        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.createElement("div");
            div.className = "a" + String(i) + ' deviceBar'; 
            barsContainer.appendChild(div); 
        }
    }

    // Remove bar elements
    removeBars() {
        // Remove all bars
        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.getElementsByClassName('a' + i);
            div[0].remove(); 
        }
    }

    // Animate bar elements
    animateBars() {
        // Animate bars
        for (let i = 0; i < this.numberOfBars; i++) {
            this.animateHeight('.a' + String(i));
            this.animateDiff('.a' + String(i));
        }
    }

    // When the UI renders...
    componentDidMount() {
        // Retrieve device name and render bars
        this.props.MMICommand(6);
        this.createBars();
        
        // Update device name whenever a new device connects
        this.props.socket.on("Device_Connected", () => {
            this.props.MMICommand(6);
        });

        // Update device name locally
        this.props.socket.on("Device_Name_Change", (deviceName) => {
            this.setState(
                {
                    deviceName: deviceName
                }
            );
        });

        // Listen for play pause changes and pause bars accordingly
        this.props.socket.on("PP_Change", (isPaused) => {
            if (isPaused) {
                this.removeBars();
                this.createBars();
            } else {
                this.removeBars();
                this.createBars();
                this.animateBars();
            }
        });
    }

    // When the UI unrenders...
    componentWillUnmount() {
        this.removeBars();

        this.props.socket.off("Device_Connected");
        this.props.socket.off("Device_Name_Change");
        this.props.socket.off("PP_Change");
    }

    // Random delay offset for animation start
    getRandomDelay() {
        return Math.floor((Math.random() * 500));
    }

    // Random offset for up/down swaying
    getRandomDiff() {
        return Math.floor((Math.random() * 5) - 7);
    }

    // Random height to grow/shrink from
    getRandomHeight() {
        return Math.floor((Math.random() * 20) + 5).toString();
    }

    pairClick(command) {
        this.props.MMICommand(command);
    }

    // Animate up/down swaying 
    animateDiff(barClass) {
        anime({
            targets: barClass,
            keyframes: [
                { translateY: -this.getRandomDiff() },
                { translateY: 0 },
            ],
            easing: 'easeInOutCubic',
            duration: 1000,
            delay: this.getRandomDelay(),
            loop: true,
        });
    }

    // Animate growing/shrinking
    animateHeight(barClass) {
        anime({
            targets: barClass,
            keyframes: [
                { height: this.getRandomHeight() + 'px' },
                { height: this.getRandomHeight() + "px" },
            ],
            easing: 'easeInOutCubic',
            duration: 2000,
            direction: 'alternate',
            delay: this.getRandomDelay(),
            loop: true,
        });
    }

    // Animate growing/shrinking
    animatePauseHeight(barClass) {
        anime({
            targets: barClass,
            keyframes: [
                { height: '5px' },
            ],
            loop: true,
        });
    }

    // Animate up/down swaying 
    animatePauseDiff(barClass) {
        anime({
            targets: barClass,
            keyframes: [
                { translateY: 10 },
            ],
            loop: true,
        });
    }

    // Render UI
    render() {
        return (
            <Fragment>
                <button className = "deviceContainer" onClick = { () => this.pairClick(3) } >
                    <div id = "barsContainer" className ='barsContainer' />

                    <p className = "deviceName">
                        { this.state.deviceName }
                    </p>
                </button>
            </Fragment>
        )
    }
};

const ConnectedDeviceWithSocket = (props) => (
    <SocketContext.Consumer>
      {socket => <ConnectedDevice {...props} socket={socket} />}
    </SocketContext.Consumer>
);


export default ConnectedDeviceWithSocket;