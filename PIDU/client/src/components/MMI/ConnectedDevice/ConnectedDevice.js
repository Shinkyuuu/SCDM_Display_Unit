import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import "./ConnectedDevice.css";

class ConnectedDevice extends Component {
    constructor(props) {
        super(props);
        this.numberOfBars = 4;
    }

    componentDidMount() {
        this.barsContainer = document.getElementById("barsContainer");

        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.createElement("div");
            div.className = "a" + String(i) + ' deviceBar'; 
            this.barsContainer.appendChild(div); 
        }

        for (let i = 0; i < this.numberOfBars; i++) {
            this.animateHeight('.a' + String(i));
            this.animateDiff('.a' + String(i));

        }
    }

    componentWillUnmount() {
        for (let i = 0; i < this.numberOfBars; i++) {
            let div = document.getElementsByClassName('a' + i);
            div[0].remove(); 
        }
    }

    getRandomDelay() {
        return Math.floor((Math.random() * 500));
    }

    getRandomDiff() {
        return Math.floor((Math.random() * 5) + 5);
    }

    getRandomHeight() {
        return Math.floor((Math.random() * 20) + 10).toString();
    }

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

    render() {
        return (
            <Fragment>
                <div className = "deviceContainer">
                    <div id = "barsContainer" className ='barsContainer' />

                    <p className = "deviceName">
                        Cody's Galaxy
                    </p>
                </div>
            </Fragment>
        )
    }
};

export default ConnectedDevice;
