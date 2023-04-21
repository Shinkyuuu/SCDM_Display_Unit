import React, { Component, Fragment } from "react";
import anime from 'animejs/lib/anime.es.js';
import SocketContext from '../../../context/socket/socket.js';

import "./SongData.css";


class SongData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            songName: "",
            artistName: ""
        };          
    }

    componentDidMount() {
        this.requestSongDataInverval = setInterval(() => {
            this.props.MMICommand(5);
        }, 1000);

        this.props.socket.on("Song", (data) => {
            this.setState(
                {
                    songName: data.songName,
                    artistName: data.artistName
                }
            );
        });
    }

    componentWillUnmount() {
        // this.props.socket.off("Song_Change");
        clearInterval(this.requestSongDataInverval);
    }

    convertHexToUTF8(byteArray) {
        var hex  = byteArray.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    render() {
        return (
            <Fragment>
                <div className = "songContainer">
                    <p className = "songName">
                        <b>{ this.state.songName }</b>
                    </p>
                    <p className = "artistName">
                        { this.state.artistName }
                    </p>
                </div>
            </Fragment>
        )
    }
};

const SongDataWithSocket = (props) => (
    <SocketContext.Consumer>
      {socket => <SongData {...props} socket={socket} />}
    </SocketContext.Consumer>
);

export default SongDataWithSocket;
