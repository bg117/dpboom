'use client';

import { useSession } from '@/hooks/session';
import { useRouter } from 'next/navigation';
import { Content } from './content';
import { useGetUserEvents } from '@/hooks/events';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

export default function ProfileComponent() {
    const { isLoading, session } = useSession();
    const {
        data,
        isLoading: isDataLoading,
        isError,
        error
    } = useGetUserEvents(session?.user?.id ?? '');

    const router = useRouter();

    if (isLoading || isDataLoading) {
        return (
            <Content>
                <h1>Loading...</h1>
            </Content>
        );
    }

    if (isError) {
        return (
            <Content>
                <h1>Error</h1>
                <p>{error.message}</p>
            </Content>
        );
    }

    if (session === null) {
        router.push('/login');
        return (
            <Content>
                <h1>Redirecting...</h1>
            </Content>
        );
    }

    if (!data) {
        return (
            <Content>
                <h1>No Events</h1>
                <p>There are currently no events.</p>
            </Content>
        );
    }

    return (
        <Content>
            <h1>Profile</h1>
            <div className="mb-4">
                <h6 className="text-muted">User ID: {session.user.id}</h6>
                <h6 className="text-muted">Email: {session.user.email}</h6>
            </div>

            <h2>Events</h2>
            <div>
                <Button
                    className="mb-4 inline-block"
                    variant="outline-primary"
                    href="/events/create"
                >
                    Create Event
                </Button>
                {data.map(event => (
                    <Card key={event.slug} className="mb-4">
                        <Row className="g-0">
                            <Col xs={12} md={4}>
                                <Card.Img
                                    variant="top"
                                    src={event.frame}
                                    alt={event.name}
                                    className="img-fluid object-fit-fill"
                                />
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>{event.name}</Card.Title>
                                    <Card.Text>{event.caption}</Card.Text>
                                    <Link
                                        className="stretched-link"
                                        href={`/events/${event.slug}`}
                                    >
                                        View Event
                                    </Link>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
        </Content>
    );
}
