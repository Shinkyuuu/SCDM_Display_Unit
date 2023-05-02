import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import SocketContext from '../../../context/socket/socket.js';
import "./Skips.css";


class Skips extends Component {
    constructor(props) {
        super(props);

        this.offset = 20;
    }

    // When the UI renders...
    componentDidMount() {
    }

    // Handle skip forward button press
    skipForwardClick(command) {
        var currDuration = 600;
        var currEasing = 'easeOutQuart';

        anime({
            targets: '#skipForwardBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });

        anime({
            targets: ".r1",
            points: [
                { value: 
                    (this.offset + 43.3) + ",100 " +
                    (this.offset + 43.3) + ",100 " +
                    (this.offset + 43.3) + ",100 " +
                    (this.offset + 43.3) + ",100 "
                },
                { value: 
                    this.offset + ",50 " +
                    this.offset + ",150 " +
                    (this.offset + 86.6) + ",100 " +
                    this.offset + ",50 "
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });
        
        anime({
            targets: ".r2",
            points: [
                { value: 
                    this.offset + ",50 " +
                    this.offset + ",150 " +
                    (this.offset + 86.6) + ",100 " +
                    this.offset + ",50 "
                },
                { value: 
                    (this.offset + 100) + ",50 " +
                    (this.offset + 100) + ",150 " +
                    (this.offset + 186.6) + ",100 " +
                    (this.offset + 100) + ",50 "
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });
        
        anime({
            targets: ".r3",
            points: [
                { value: 
                    (this.offset + 100) + ",50 " +
                    (this.offset + 100) + ",150 " +
                    (this.offset + 186.6) + ",100 " +
                    (this.offset + 100) + ",50 "
                },
                { value: 
                    (this.offset + 150) + ",100 " +
                    (this.offset + 150) + ",100 " +
                    (this.offset + 150) + ",100 " +
                    (this.offset + 150) + ",100 "
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });

        this.props.MMICommand(command);
    }

    // Handle skip backward button press
    skipBackwardClick(command) {
        var currDuration = 600;
        var currEasing = 'easeOutQuart';

        anime({
            targets: '#skipBackwardBtn',
            keyframes: [
                {scale: 0.9},
                {scale: 1},
            ],
            duration: 400,
            easing: 'easeOutExpo',
        });

        anime({
            targets: ".l1",
            points: [
                { value: 
                    (this.offset + 86.6) + ",50 " +
                    (this.offset + 86.6) + ",150 " + 
                    this.offset + ",100 " +
                    (this.offset + 86.6) + ",50"
                },
                { value: 
                    (this.offset + 43.3) + ",100 " + 
                    (this.offset + 43.3) + ",100 " + 
                    (this.offset + 43.3) + ",100 " + 
                    (this.offset + 43.3) + ",100 "
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });
        
        anime({
            targets: ".l2",
            points: [
                { value: 
                    (this.offset + 186.6) + ",50 " +
                    (this.offset + 186.6) + ",150 " +
                    (this.offset + 100) + ",100 " +
                    (this.offset + 186.6) + ",50"
                },
                { value: 
                    (this.offset + 86.6) + ",50 " +
                    (this.offset + 86.6) + ",150 " + 
                    this.offset + ",100 " +
                    (this.offset + 86.6) + ",50"
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });
        
        anime({
            targets: ".l3",
            points: [
                { value: 
                    (this.offset + 143.3) + ",100 " +
                    (this.offset + 143.3) + ",100 " +
                    (this.offset + 143.3) + ",100 " +
                    (this.offset + 143.3) + ",100 "
                },
                { value: 
                    (this.offset + 186.6) + ",50 " +
                    (this.offset + 186.6) + ",150 " +
                    (this.offset + 100) + ",100 " +
                    (this.offset + 186.6) + ",50"
                },
            ],
            duration: currDuration,
            easing: currEasing,
        });
        
        this.props.MMICommand(command);
    }

    // Render UI
    render() {
        return (
            <Fragment>
                <button id = "skipBackwardBtn" className = "skipBtn" onClick={() => this.skipBackwardClick(2)}> 
                    <svg className = "SContainer" width="255px" height="200px">
                        <g>
                            <polyline className = "SSymbol l1" 
                                points = { 
                                    (this.offset + 86.6) + ",50 " +
                                    (this.offset + 86.6) + ",150 " + 
                                    this.offset + ",100 " +
                                    (this.offset + 86.6) + ",50" } />
                            <polyline className = "SSymbol l2" 
                                points = {
                                    (this.offset + 186.6) + ",50 " +
                                    (this.offset + 186.6) + ",150 " +
                                    (this.offset + 100) + ",100 " +
                                    (this.offset + 186.6) + ",50" } />
                            <polyline className = "SSymbol l3" 
                                points = {
                                    (this.offset + 186.6) + ",50 " +
                                    (this.offset + 186.6) + ",150 " +
                                    (this.offset + 100) + ",100 " +
                                    (this.offset + 186.6) + ",50" } />
                        </g>
                    </svg>
                </button>
                <button id = "skipForwardBtn" className = "skipBtn" onClick={() => this.skipForwardClick(1)}> 
                    <svg className = "SContainer" width="225px" height="200px">
                        <g>
                            <polyline className = "SSymbol r1" 
                                points= { 
                                    this.offset + ",50 " +
                                    this.offset + ",150 " +
                                    (this.offset + 86.6) + ",100 " +
                                    this.offset + ",50 " 
                                } />
                            <polyline className = "SSymbol r2" 
                                points= { 
                                    this.offset + ",50 " +
                                    this.offset + ",150 " +
                                    (this.offset + 86.6) + ",100 " +
                                    this.offset + ",50 " 
                                } />
                            <polyline className = "SSymbol r3" 
                                points= { 
                                    (this.offset + 100) + ",50 " +
                                    (this.offset + 100) + ",150 " +
                                    (this.offset + 186.6) + ",100 " +
                                    (this.offset + 100) + ",50 " 
                                } />
                        </g>
                    </svg>
                </button>
            </Fragment>        
        );
    };
};

const SkipsWithSocket = (props) => (
    <SocketContext.Consumer>
      {socket => <Skips {...props} socket={socket} />}
    </SocketContext.Consumer>
);


export default SkipsWithSocket;