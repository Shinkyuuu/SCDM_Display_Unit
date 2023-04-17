import React from "react";
import socketio from "socket.io-client";

const SOCKET_URL = "http://localhost:3001/";

export const socket = socketio.connect(SOCKET_URL, {  
    withCredentials: false,
    closeOnBeforeunload: false
});

export const SocketContext = React.createContext();