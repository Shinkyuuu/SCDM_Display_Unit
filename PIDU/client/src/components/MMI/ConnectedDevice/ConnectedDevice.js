import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import "./ConnectedDevice.css";


class ConnectedDevice extends Component {
    constructor(props) {
        super(props);
        this.numberOfBars = 4;
    }

    // When the UI renders...
    componentDidMount() {
        this.barsContainer = document.getElementById("barsContainer");

        // Add bar DOMs
        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.createElement("div");
            div.className = "a" + String(i) + ' deviceBar'; 
            this.barsContainer.appendChild(div); 
        }

        // Animate bars
        for (let i = 0; i < this.numberOfBars; i++) {
            this.animateHeight('.a' + String(i));
            this.animateDiff('.a' + String(i));
        }
    }

    // When the UI unrenders...
    componentWillUnmount() {
        // Remove all bars
        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.getElementsByClassName('a' + i);
            div[0].remove(); 
        }
    }

    // Random delay offset for animation start
    getRandomDelay() {
        return Math.floor((Math.random() * 500));
    }

    // Random offset for up/down swaying
    getRandomDiff() {
        return Math.floor((Math.random() * 5) + 5);
    }

    // Random height to grow/shrink from
    getRandomHeight() {
        return Math.floor((Math.random() * 20) + 10).toString();
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

    // Render UI
    render() {
        return (
            <Fragment>
                <button className = "deviceContainer" onClick = { () => this.pairClick(3) } >
                    <div id = "barsContainer" className ='barsContainer' />

                    <p className = "deviceName">
                        Cody's Galaxy
                    </p>
                </button>
            </Fragment>
        )
    }
};

export default ConnectedDevice;
