'use client';

import React, {useCallback} from "react";
import {Content} from "@/components/content";
import {Button, Col, Row} from "react-bootstrap";
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();

    const navigateToEvents = useCallback(() => router.push("/events"), [router]);

    return (
        <Content>
            <Row className="flex-grow-1 d-flex flex-column justify-content-center align-content-center">
                <Col lg={8}>
                    <h1>dpBoom!</h1>
                    <p>dpBoom! is a simple, easy to use, and free to use profile frame generator, designed to be
                        a replacement for Twibbonize.</p>
                    <Button color="primary" onClick={navigateToEvents}>Get Started</Button>
                </Col>
            </Row>
        </Content>
    );
}