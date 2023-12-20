import Link from "next/link";
import { Card, Row, Col } from "react-bootstrap";

type EventProps = {
    name: string;
    creator: string;
    caption: string;
    frame: string;
    slug: string;
};

export default function Event(props: EventProps) {
    const { name, creator, caption, frame, slug } = props;
    return (
        <Card key={slug} className="mb-4">
            <Row className="g-0">
                <Col xs={12} md={4}>
                    <Card.Img
                        variant="top"
                        src={frame}
                        alt={name}
                        className="img-fluid object-fit-fill"
                    />
                </Col>
                <Col>
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            by {creator}
                        </Card.Subtitle>
                        <Card.Text>{caption}</Card.Text>
                        <Link
                            className="stretched-link"
                            href={`/events/${slug}`}
                        >
                            View Event
                        </Link>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}
