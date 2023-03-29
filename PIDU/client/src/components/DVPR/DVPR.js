import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./DVPR.css";


/**
 * 
 * @returns MMI Fragment
 */
const DVPR = () => {
    const navigate = useNavigate();

    const goToMMI = () => {
        navigate("/");
    }

    return (
        <Fragment>
            <h1>DVPR</h1>
            <button onClick={goToMMI}>MMI</button>
        </Fragment>
    );
};

export default DVPR;
