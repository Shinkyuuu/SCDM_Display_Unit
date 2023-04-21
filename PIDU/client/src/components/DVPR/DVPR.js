import React, { Fragment, Component } from "react";
import { useNavigate } from "react-router-dom";
import "./DVPR.css";
import SocketContext from '../../context/socket/socket.js';


/**
 * 
 * @returns MMI Fragment
 */
class DVPR extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            toFrom: [],
            packets: [],
        };
    }

    componentDidMount() {
        const scrollingElement = (document.scrollingElement || document.body);

        this.props.socket.emit("packets_request");

        this.props.socket.on("packets_data", (packetData) => {
            this.setState({
                count: packetData.count,
                toFrom: packetData.toFrom,
                packets: packetData.packets
            }, () => {
                this.addTexts();
                scrollingElement.scrollTop = scrollingElement.scrollHeight;
            });
        });
    }

    componentWillUnmount() {
        
    
    }

    addTexts() {
        let chatContainer = document.getElementById("chatContainer");

        while (chatContainer.firstChild) {
            chatContainer.removeChild(chatContainer.firstChild);
        }

        for (let i = 0; i < this.state.count; ++i) {
            let senderContainer = document.createElement("div");

            senderContainer.className = (this.state.toFrom[i] === "to") ? "chat chat-end" : "chat chat-start";
            let senderText = document.createElement("div");
            const senderClass = "chat-bubble \
                                text-senderTextColor \
                                bg-senderBGColor \
                                max-w-[1000px]";
            
            const receiverClass = "chat-bubble \
                                text-receiverTextColor \
                                bg-receiverBGColor \
                                max-w-[1000px]";
            senderText.className = (this.state.toFrom[i] === "to") ? senderClass : receiverClass;
            senderText.innerHTML = this.state.packets[i].toString();
            chatContainer.appendChild(senderContainer);
            senderContainer.appendChild(senderText);
        }
    }

    goToHome() {
        this.props.navigate('/');
    }

    render() {
        return (
            <Fragment>
                <div className = "header">
                    <h1 className = "title">&lt;<b>Audio</b> Interface/&gt;</h1>
                    <button className = "navHomeBtn" onClick = { () => { this.goToHome() }}>HOME</button>
                </div>
                <div id = "chatContainer">
                </div>
            </Fragment>
        );
    }
    
};

const DVPRWithSocket = (props) => {
    const navigate = useNavigate();

    return (
        <SocketContext.Consumer>
            {socket => <DVPR {...props} socket={socket} navigate = {navigate} />}
        </SocketContext.Consumer>
    );
};

export default DVPRWithSocket;

// export default DVPR;
