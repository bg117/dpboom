'use client';

import {Content} from "@/components/content";
import {useRouter} from "next/navigation";
import React, {ChangeEvent, FormEvent, useCallback, useState} from "react";
import {client} from "@/utils/supabase";
import {Alert, Button, Card, Form} from "react-bootstrap";

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [validated, setValidated] = useState(false);

    const router = useRouter();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        setValidated(true);
        if (!form.checkValidity()) {
            e.stopPropagation();
            return;
        }

        setError(null);

        const {error} = await client.auth.signInWithPassword({email, password});

        if (error) {
            setError(error.message);
            return;
        }

        router.push('/');
    }, [router, email, password]);

    const changeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), []);
    const changePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value), []);

    return <Content>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <Card className="grid">
                <Card.Body>
                    <Card.Title as="h2">Login</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} noValidate validated={validated}>
                        <Form.Group className="mb-3 required" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" onChange={changeEmail}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3 required" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" onChange={changePassword}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </Content>;
}