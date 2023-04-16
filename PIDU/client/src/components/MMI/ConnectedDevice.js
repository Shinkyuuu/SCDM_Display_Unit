import React, { Component, Fragment } from "react";
import "./MMI.css";

class ConnectedDevice extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className = "deviceContainer">
                    <div className = "deviceIcon">

                    </div>
                    <p className = "deviceName">
                        Cody's Galaxy
                    </p>
                </div>
            </Fragment>
        )
    }
};

export default ConnectedDevice;
