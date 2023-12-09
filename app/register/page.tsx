'use client';

import {Content} from "@/components/content";
import {ChangeEvent, FormEvent, useCallback, useState} from "react";
import {client} from "@/utils/supabase";
import {useRouter} from "next/navigation";
import {Alert, Button, Card, Form} from "react-bootstrap";

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const router = useRouter();

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);

        client.auth.signUp({email, password})
            .then(({error}) => {
                if (error) {
                    setError(error.message);
                    return;
                }

                router.push('/');
            });
    }, [email, password, confirmPassword]);

    const changeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), []);
    const changePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value), []);
    const changeConfirmPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value), []);

    return <Content>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <Card className="grid">
                <Card.Body>
                    <Card.Title as="h2">Register</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" onChange={changeEmail}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={changePassword}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm Password" onChange={changeConfirmPassword}/>
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