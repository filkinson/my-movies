import { Link, useMatch, useResolvedPath } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    return <nav className="nav">
        <ul>
            <CustomLink to="/">Home</CustomLink>
            <CustomLink to="/movies">Movies</CustomLink>
            <CustomLink to="/register">Register</CustomLink>
            <CustomLink to="/login">Login</CustomLink>                                  
        </ul>
    </nav>
    }

function CustomLink({to, children}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to}>
                {children}
            </Link>
        </li>
    )

}