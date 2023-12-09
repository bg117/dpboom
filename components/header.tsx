'use client'

import Link from "next/link";
import useSession from "@/hooks/useSession";
import React, {ReactNode, MouseEvent, useCallback} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";

function HeaderLink({href, children, LinkProps}: { href: string, children: ReactNode, LinkProps?: any }) {
    return <Nav.Item>
        <Nav.Link as={Link} href={href} {...LinkProps}>{children}</Nav.Link>
    </Nav.Item>;
}

export function Header() {
    const {session, client} = useSession();

    const handleLogout = useCallback((e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        client.auth.signOut()
            .then()
    }, [client]);

    return <Navbar expand="lg" collapseOnSelect className="bg-success-subtle">
        <Container>
            <Navbar.Brand as={Link} href="/">dpBoom!</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarSupportedContent"/>
            <Navbar.Collapse id="navbarSupportedContent">
                <Nav className="me-auto mb-2 mb-lg-0">
                    <HeaderLink href="/events">Events</HeaderLink>
                </Nav>
                <Nav className="ms-auto mb-2 mb-lg-0">
                    {session ? <>
                        <HeaderLink href="/profile">Profile</HeaderLink>
                        <HeaderLink href="/logout" LinkProps={{
                            onClick: handleLogout
                        }}>Logout</HeaderLink>
                    </> : <>
                        <HeaderLink href="/login">Login</HeaderLink>
                        <HeaderLink href="/register">Register</HeaderLink>
                    </>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}