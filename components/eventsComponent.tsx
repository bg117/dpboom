'use client';

import { useSession } from '@/hooks/session';
import { useGetEvents } from '@/hooks/events';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Content } from '@/components/content';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Event from './event';

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
            <div>
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
                {data.map(event => (
                    <Event
                        key={event.slug}
                        creator={event.display_name}
                        {...event}
                    />
                ))}
            </div>
        </Content>
    );
}
