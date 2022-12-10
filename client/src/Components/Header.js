import React from "react";
// import {Link} from "react-router";
export const Header = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
            <div className="navbar-header">
                <ul className="nav navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                </ul>
            </div>
            </div>
        </nav>
    );
};
  