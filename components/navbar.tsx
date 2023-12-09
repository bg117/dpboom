'use client'

import Link from "next/link";
import React, {useEffect, useState} from "react";
import {client} from "@/utils/supabase";

function NavLink({href, children}: { href: string, children: React.ReactNode }) {
    return <li className="nav-item">
        <Link className="nav-link active" href={href}>{children}</Link>
    </li>;
}

export function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        client.auth.onAuthStateChange((_, session) => {
            setLoggedIn(session !== null);
        })
    }, []);

    return <nav className="navbar navbar-expand-lg bg-success-subtle">
        <div className="container">
            <Link className="navbar-brand" href="/">dpBoom!</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {loggedIn ? <>
                        <NavLink href="/events">Events</NavLink>
                        <NavLink href="/logout">Logout</NavLink>
                    </> : <>
                        <NavLink href="/login">Login</NavLink>
                        <NavLink href="/register">Register</NavLink>
                    </>}
                </ul>
            </div>
        </div>
    </nav>;
}