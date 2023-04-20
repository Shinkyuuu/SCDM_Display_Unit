import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import SocketContext from '../../../context/socket/socket.js';
import "./PlayPause.css";


class PlayPause extends Component {
    constructor(props) {
        super(props);

        this.state =  {
            isPaused: true
        };
    }

    // When the UI renders...
    componentDidMount() {
        // Set up listener for play/pause change
        this.props.socket.on("Play/Pause_Change", (ppState) => {
            console.debug("Play Pause State: " + ppState);

            // If the play/pause state is already synced, don't animate the button
            if ((ppState === 2) !== this.state.isPaused) {
                this.setState({ isPaused: (ppState === 2) }, () => {
                    this.animatePP();
                });
            }
        });
    }

    // When the UI is about to unrender, disconnect from socket.io
    componentWillUnmount() {
    }

    // Animate play/pause button
    animatePP() {
        anime({
            targets: '#playPauseBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });

        let leftPPPath = [];
        let rightPPPath = [];

        if (!this.state.isPaused) {
            leftPPPath = [ { value: "M50,50 L50,150 L136.6,100 Z" }, { value: "M50,50 L50,150 L50,100 Z" } ];
            rightPPPath = [ { value: "M50,50 L50,150 L136.6,100 Z" }, { value: "M136.6,50 L136.6,150 L136.6,100 Z" } ];
        } else {
            leftPPPath = [ { value: "M50,50 L50,150 L50,100 Z" }, { value: "M50,50 L50,150 L136.6,100 Z" } ];
            rightPPPath = [ { value: "M136.6,50 L136.6,150 L136.6,100 Z" }, { value: "M50,50 L50,150 L136.6,100 Z" } ];
        }

        anime({
            targets: '.PPLeft',
            d: leftPPPath,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: 500
        });
        
        anime({
            targets: '.PPRight',
            d: rightPPPath,
            easing: 'cubicBezier(.5, .05, .1, .3)',
            duration: 500
        });
    };

    // Handle play/pause button press
    playPauseClick(command) {
        this.setState({ isPaused: !this.state.isPaused }, () => {
            this.animatePP();
            this.props.MMICommand(command);
        });
    };

    // Render UI
    render() {
        return (
            <Fragment>
                <button id = "playPauseBtn" onClick={ () => this.playPauseClick(0) }>
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
            </Fragment>        
        );
    };
};

const PlayPauseWithSocket = (props) => (
    <SocketContext.Consumer>
      {socket => <PlayPause {...props} socket={socket} />}
    </SocketContext.Consumer>
);

export default PlayPauseWithSocket;
