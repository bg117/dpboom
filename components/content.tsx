import React from 'react';
import { Header } from '@/components/header';
import { Container } from 'react-bootstrap';

export function Content({ children }: { children: React.ReactNode }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Container className="flex-grow-1 d-flex flex-column pt-4">
                {children}
            </Container>
        </div>
    );
}
