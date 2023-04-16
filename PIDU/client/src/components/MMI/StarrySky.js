import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';

import "./MMI.css";

class StarrySky extends Component {
    constructor(props) {
        super(props);
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

    render() {
        return (
            <Fragment>
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
        )
    }
};

export default StarrySky;
