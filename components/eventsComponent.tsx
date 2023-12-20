'use client';

import { useSession } from '@/hooks/session';
import { useGetEvents } from '@/hooks/events';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Content } from '@/components/content';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';

export default function EventsComponent() {
    const { session } = useSession();
    const { data, isLoading, isError, error } = useGetEvents();
    const router = useRouter();

    const navigateToCreate = useCallback(
        () => router.push('/events/create'),
        [router]
    );

    if (isLoading) {
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
                <p>{error?.message}</p>
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
            <h1>Events</h1>
            {session && (
                <div className="d-inline-block mb-4">
                    <Button
                        onClick={navigateToCreate}
                        variant="outline-primary"
                    >
                        Create Event
                    </Button>
                </div>
            )}
            <Row>
                {data!.map(event => (
                    <Col
                        lg={4}
                        md={6}
                        key={event.slug}
                        className="mb-4 d-flex flex-column"
                    >
                        <Card className="flex-grow-1">
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    by {event.display_name}
                                </Card.Subtitle>
                                <Card.Text>{event.caption}</Card.Text>
                                <Link
                                    className="stretched-link"
                                    href={`/events/${event.slug}`}
                                >
                                    View Event
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Content>
    );
}
