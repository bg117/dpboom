'use client'

import Link from "next/link";
import useSession from "@/hooks/useSession";
import {ReactNode, MouseEvent, useCallback} from "react";

function NavLink({href, children, LinkProps}: { href: string, children: ReactNode, LinkProps?: any }) {
    return <li className="nav-item">
        <Link className="nav-link active" href={href} {...LinkProps}>{children}</Link>
    </li>;
}

export function Navbar() {
    const {session, client} = useSession();

    const handleLogout = useCallback((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        client.auth.signOut()
            .then()
    }, [client]);

    return <nav className="navbar navbar-expand-lg bg-success-subtle">
        <div className="container">
            <Link className="navbar-brand" href="/">dpBoom!</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <NavLink href="/events">Events</NavLink>
                </ul>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {session ? <>
                        <NavLink href="/profile">Profile</NavLink>
                        <NavLink href="/logout" LinkProps={{
                            onClick: handleLogout
                        }}>Logout</NavLink>
                    </> : <>
                        <NavLink href="/login">Login</NavLink>
                        <NavLink href="/register">Register</NavLink>
                    </>}
                </ul>
            </div>
        </div>
    </nav>;
}