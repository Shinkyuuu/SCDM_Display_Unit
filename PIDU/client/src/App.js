import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import MMI from "./components/MMI/MMI";
import DVPR from "./components/DVPR/DVPR";


function App() {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<MMI />}/>
                    <Route path="/DVPR" element={<DVPR />}/>
                </Routes>
            </Router>
    );
}

export default App;