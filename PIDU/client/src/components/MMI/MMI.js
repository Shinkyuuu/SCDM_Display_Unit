import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./MMI.css";
import logo from "./logo.png";
import axios from 'axios';

const anime = require('animejs');


/**
 * 
 * @returns MMI Fragment
 */
const MMI = () => {
    const navigate = useNavigate();

    // User Bluetooth Commands
    const commands = {
        playPause: 0,
        skipForward: 1,
        skipBackward: 2,
        pair: 3,
        volumeUp: 4,
        volumeDown: 5
    }

    // Relay Bluetooth command to the Server 
    const MMICommand = (command) => {
        axios.post(`/cmd`, { opCode : Number(command)})
        .then(res => { console.log(res); console.log(res.data); });
    };

    return (
        <Fragment>
            <div className = "Header">
                <img className = "logo" src = {logo}/>
            </div>

            <div className = "MMIContainer">
                <button id = "skipBackwardBtn" onClick={() => MMICommand(commands.skipBackward)}> Skip Backwards</button>
                <button id = "playPauseBtn" onClick={() => MMICommand(commands.playPause)}> Play/Pause</button>
                <button id = "skipForwardBtn" onClick={() => MMICommand(commands.skipForward)}> Skip Forward</button>
            </div>
        </Fragment>
    );
};

export default MMI;
