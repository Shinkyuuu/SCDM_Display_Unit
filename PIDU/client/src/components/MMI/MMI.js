import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./MMI.css";
import logo from "./logo.png"
const anime = require('animejs');


/**
 * 
 * @returns MMI Fragment
 */
const MMI = () => {
    const navigate = useNavigate();

    const goToDev = () => {
        navigate("/DVPR");
    }

    const playPauseAudio = () => {
        console.debug(`MMI | Transmit Play /Pause Music`);
    };

    const skipForwardAudio = () => {
        console.debug(`MMI | Transmit Skip Forward Music`);
    };

    const skipBackwardAudio = () => {
        console.debug(`MMI | Transmit Skip Backward Music`);
    };

    return (
        <Fragment>
            <div className = "Header">
                <img className = "logo" src = {logo}/>
                <button className = "goToDevBtn" onClick={goToDev}></button>
            </div>

            <div className = "MMIContainer">
                <button id = "skipBackwardBtn" onClick={skipBackwardAudio}> Skip Backwards</button>
                <button id = "playPauseBtn" onClick={playPauseAudio}> Play/Pause</button>
                <button id = "skipForwardBtn" onClick={skipForwardAudio}> Skip Forward</button>
            </div>
        </Fragment>
    );
};

export default MMI;
