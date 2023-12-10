'use client';

import Link from "next/link";
import {useSession} from "@/hooks/session";
import {ReactNode, MouseEvent, useCallback, useState} from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

function HeaderLink({href, children, LinkProps}: { href: string, children: ReactNode, LinkProps?: any }) {
    return <Nav.Item>
        <Nav.Link as={Link} href={href} {...LinkProps}>{children}</Nav.Link>
    </Nav.Item>;
}

export function Header() {
    const [name, setName] = useState<string>('');
    const {session, client} = useSession();

    const handleLogout = useCallback((e: any) => {
        e.preventDefault();
        client.auth.signOut()
            .then()
    }, [client]);

    if (session) {
        // get profile name from user table
        client.from('profiles')
            .select('display_name')
            .eq('user_id', session.user.id)
            .limit(1)
            .single()
            .then(({data}) => {
                if (data) {
                    setName(data.display_name);
                }
            });
    }

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
                        <NavDropdown title={name} id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} href="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item as={Link} href="#" onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </> : <>
                        <HeaderLink href="/login">Login</HeaderLink>
                        <HeaderLink href="/register">Register</HeaderLink>
                    </>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}