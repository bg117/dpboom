'use client';

import { useSession } from '@/hooks/session';
import { useRouter } from 'next/navigation';
import { Content } from './content';
import { useGetUserEvents } from '@/hooks/events';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import Event from './event';

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
                <h1>No Profile Data</h1>
                <p>
                    There is no profile data for this user. Please create a
                    profile.
                </p>
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

            <h2>My Events</h2>
            <div>
                <Button
                    className="mb-4 inline-block"
                    variant="outline-primary"
                    href="/events/create"
                >
                    Create Event
                </Button>
                {data.map(event => (
                    <Event key={event.slug} creator={event.display_name} {...event} />
                ))}
            </div>
        </Content>
    );
}
