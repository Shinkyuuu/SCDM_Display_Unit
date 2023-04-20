import React from "react";
import SocketContext from "./context/socket/socket.js"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import io from 'socket.io-client';
import './App.css';

import MMI from "./components/MMI/MMI";
import DVPR from "./components/DVPR/DVPR";

const socket = io("http://localhost:3001", {
    withCredentials: false,
    closeOnBeforeunload: false
});

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Routes>
                    <Route path="/" element={<MMI />}/>
                    <Route path="/DVPR" element={<DVPR />}/>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;