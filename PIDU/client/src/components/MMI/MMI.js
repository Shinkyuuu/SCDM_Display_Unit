import React, { Component, Fragment } from "react";
import "./MMI.css";
import logo from "./assets/logo.png";
import axios from 'axios';
import StarrySky from "./StarrySky/StarrySky.js";
import PlayPauseWithSocket from "./PlayPause/PlayPause.js";
import SkipsWithSocket from "./Skips/Skips.js";
import ConnectedDeviceWithSocket from "./ConnectedDevice/ConnectedDevice.js";
import VolumeSliderWithSocket from "./VolumeSlider/VolumeSlider.js";
import SongDataWithSocket from "./SongData/SongData.js";
import SocketContext from '../../context/socket/socket.js';
import { useNavigate } from "react-router";

class MMI extends Component {
    constructor(props) {
        super(props);

        // User Bluetooth Commands
        this.commands = {
            playPause: 0,
            skipForward: 1,
            skipBackward: 2,
            pair: 3,
            setVolume: 4
        }
    }

    // When the UI renders...
    componentDidMount() {

    }

    // When the UI is about to unrender, disconnect from socket.io
    componentWillUnmount() {
    }

    // Handle pair device button press
    LogoClick(command) {
        this.MMICommand(command);
    }

    goToDVPR() {
        this.props.navigate('/DVPR');
    }

    // Send MMI command to server (to be transmitted to bluetooth module)
    MMICommand(command, parameter = null) {
        console.debug("Sending HTTP Command: " + command);
        axios.post(`/cmd`, { 
            opCode : command,
            parameter : parameter
        })
        .then(res => { console.log(res); console.log(res.data); });
    }

    // Render UI
    render() {
        return (
            <Fragment>
                <button className = "Header" onClick = { () => { this.goToDVPR() }}>
                    <img className = "logo" alt = "SCDM Logo" src = {logo}/>
                </button>
                <div className = "contentContainer">
                    <div className = "MMIContainer">
                        <PlayPauseWithSocket MMICommand = { this.MMICommand } />
                        <SkipsWithSocket MMICommand = { this.MMICommand } />
                        {/* <button className = "navDVPRBtn" onClick = { () => { this.goToDVPR() }}></button> */}
                        {/* <button onClick = { () => this.MMICommand(6) }>Ask for device name</button> */}
                    </div>
                </div>
                <SongDataWithSocket MMICommand = { this.MMICommand } />
                <ConnectedDeviceWithSocket MMICommand = { this.MMICommand } />
                <VolumeSliderWithSocket MMICommand = { this.MMICommand } />
                <StarrySky />
            </Fragment>        
        );
    };
};

const MMIWithSocket = (props) => {
    const navigate = useNavigate();

    return (
        <SocketContext.Consumer>
            {socket => <MMI {...props} socket={socket} navigate = {navigate} />}
        </SocketContext.Consumer>
    )
}


export default MMIWithSocket;