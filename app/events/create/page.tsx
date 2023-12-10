'use client';

import {Content} from "@/components/content";
import {Alert, Button, Form} from "react-bootstrap";
import {ChangeEvent, useCallback, useState} from "react";

export default function Events() {
    const [eventName, setEventName] = useState('');
    const [eventCaption, setEventCaption] = useState('');
    const [eventFramePath, setEventFramePath] = useState('');
    const [eventFrame, setEventFrame] = useState<string | ArrayBuffer | null>(null);
    const [eventIsPublic, setEventIsPublic] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    const changeEventName = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventName(event.target.value), []);
    const changeEventCaption = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setEventCaption(event.target.value), []);
    const changeEventFramePath = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setEventFramePath(event.target.value)
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setEventFrame(e.target?.result ?? null);
            reader.readAsDataURL(file);
        }
    }, []);
    const changeEventIsPublic = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventIsPublic(event.target.checked), []);

    const handleSubmit = useCallback((event: ChangeEvent<HTMLFormElement>) => {
        const form = event.currentTarget;

        setValidated(true);
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        console.log(eventName, eventCaption, eventFramePath, eventFrame, eventIsPublic);
        setError('Not implemented yet');
    }, [eventName, eventCaption, eventFramePath, eventFrame, eventIsPublic]);

    return <Content>
        <h1>Create an Event</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formEventName" className="mb-3 required">
                <Form.Label>Event Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter event name" onChange={changeEventName}/>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event name.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEventEnd" className="mb-3 d-flex flex-column">
                <Form.Label>Ends at</Form.Label>
                <Form.Control type="datetime-local" placeholder="Enter event end date"/>
            </Form.Group>

            <Form.Group controlId="formEventCaption" className="mb-3 required">
                <Form.Label>Event Caption</Form.Label>
                <Form.Control required as="textarea" rows={3} placeholder="Enter event caption" onChange={changeEventCaption}/>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event caption.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEventFrame" className="mb-3 required">
                <Form.Label>Event Frame</Form.Label>
                <Form.Control required type="file" accept="image/*" onChange={changeEventFramePath}/>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event frame.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEventIsPublic" className="mb-3">
                <Form.Check type="checkbox" label="Show event publicly" checked={eventIsPublic}
                            onChange={changeEventIsPublic}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </Content>;
};