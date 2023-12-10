'use client';

import {Content} from "@/components/content";
import {ChangeEvent, FormEvent, useCallback, useState} from "react";
import {client} from "@/utils/supabase";
import {useRouter} from "next/navigation";
import {Alert, Button, Card, Form} from "react-bootstrap";

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [validated, setValidated] = useState(false);

    const router = useRouter();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;

        setValidated(true);
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);

        const {data, error} = await client.auth.signUp({email, password});
        if (error) {
            setError(error.message);
            return;
        }

        const {error: profileError} = await client
            .from('profiles')
            .insert({
                display_name: name,
                user_id: data.user?.id,
            });

        if (profileError) {
            setError(profileError.message);
            return;
        }

        router.push('/');
    }, [name, router, email, password, confirmPassword]);

    const changeName = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), []);
    const changeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), []);
    const changePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value), []);
    const changeConfirmPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value), []);

    return <Content>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <Card className="grid">
                <Card.Body>
                    <Card.Title as="h2">Register</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} noValidate validated={validated}>
                        <Form.Group className="mb-3 required" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Name" onChange={changeName}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                            </Form.Control.Feedback>
                        </Form.Group>

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

                        <Form.Group className="mb-3 required" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control required type="password" placeholder="Confirm Password"
                                          onChange={changeConfirmPassword}/>
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