'use client';

import {Content} from "@/components/content";
import {useSession} from "@/hooks/session";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useGetEntries} from "@/hooks/entries";

export default function Events() {
    const {session} = useSession();
    const {data, isLoading, isError, error} = useGetEntries();

    return <Content>
        <h1>Events</h1>
        {session &&
            <div className="d-inline-block mb-4">
                <Button href="/events/create">Create Event</Button>
            </div>}
        {isLoading && <h2>Loading...</h2>}
        {isError && <h2>{error?.message}</h2>}
        <Row>
            {data?.map((event) =>
                <Col lg={4} md={6} key={event.slug} className="mb-4 d-flex flex-column">
                    <Card className="flex-grow-1">
                        <Card.Body>
                            <Card.Title>{event.name}</Card.Title>
                            {event.ends_at &&
                                <Card.Subtitle className="mb-2 text-muted">Ends at {new Date(event.ends_at).toLocaleString()}</Card.Subtitle>}
                            <Card.Text>{event.caption}</Card.Text>
                            <Button href={`/events/${event.slug}`}>View Event</Button>
                        </Card.Body>
                    </Card>
                </Col>)}
        </Row>
    </Content>;
};