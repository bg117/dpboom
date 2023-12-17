'use client';

import {Content} from "@/components/content";
import {useSession} from "@/hooks/session";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useGetEvents} from "@/hooks/events";
import Link from "next/link";

export default function Events() {
    const {session} = useSession();
    const {data, isLoading, isError, error} = useGetEvents();

    return <Content>
        <h1>Events</h1>
        {session &&
            <div className="d-inline-block mb-4">
                <Button href="/events/create" variant="outline-primary">Create Event</Button>
            </div>}
        {isLoading && <h5>Loading...</h5>}
        {isError && <h5>{error?.message}</h5>}
        <Row>
            {data?.map((event) =>
                <Col lg={4} md={6} key={event.slug} className="mb-4 d-flex flex-column">
                    <Card className="flex-grow-1">
                        <Card.Body>
                            <Card.Title>{event.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">by {event.display_name}</Card.Subtitle>
                            <Card.Text>{event.caption}</Card.Text>
                            <Link className="stretched-link" href={`/events/${event.slug}`}>View Event</Link>
                        </Card.Body>
                    </Card>
                </Col>)}
        </Row>
    </Content>;
};