'use client';

import {Content} from "@/components/content";
import {useRouter} from "next/navigation";
import {FormEvent, useCallback, useState} from "react";
import {client} from "@/utils/supabase";

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const router = useRouter();

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);

        client.auth.signInWithPassword({email, password})
            .then(({error}) => {
                if (error) {
                    setError(error.message);
                    return;
                }

                router.push('/');
            });
    }, [email, password]);

    const changeEmail = useCallback((e: FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), []);
    const changePassword = useCallback((e: FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value), []);

    return <Content>
        <div className="flex-grow-1 d-flex flex-column justify-content-center">
            <div className="card grid">
                <div className="card-body">
                    <h1 className="card-title">Login</h1>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Email"
                                   onChange={changeEmail}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password"
                                   onChange={changePassword}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </Content>;
}