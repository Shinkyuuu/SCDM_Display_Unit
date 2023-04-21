import React from "react";
import SocketContext from "./context/socket/socket.js"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import io from 'socket.io-client';
import './App.css';

import MMIWithSocket from "./components/MMI/MMI";
import DVPRWithSocket from "./components/DVPR/DVPR";

const socket = io("http://localhost:3001", {
    withCredentials: false,
    closeOnBeforeunload: false
});

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Routes>
                    <Route path="/" element={<MMIWithSocket />}/>
                    <Route path="/DVPR" element={<DVPRWithSocket />}/>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;