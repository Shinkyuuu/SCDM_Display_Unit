import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import "./StarrySky.css";


class StarrySky extends Component {
    // When the UI renders...
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

    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
    }

    // Random radius for star
    randomRadius() {
        return Math.random() * 2.7 + 1.6;
    }

    // Random X position for star
    getRandomX() {
        return Math.floor(Math.random() * Math.floor(window.innerWidth)).toString();
    }

    // Random Y position for star
    getRandomY() {
        return Math.floor(Math.random() * Math.floor(window.innerHeight)).toString();
    }

    // Render UI
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
                            fill="#FFFFFFd7"
                            className="star"
                        />
                    ))}
                </svg>
            </Fragment>
        )
    }
};

export default StarrySky;
