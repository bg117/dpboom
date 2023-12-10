'use client';

import {Content} from "@/components/content";
import {Alert, Button, Form, Image} from "react-bootstrap";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useInsertEntry} from "@/hooks/entries";
import {useSession} from "@/hooks/session";
import {useRouter} from "next/navigation";

export default function Events() {
    const [eventName, setEventName] = useState('');
    const [eventEndsAt, setEventEndsAt] = useState<string | null>(null);
    const [eventSlug, setEventSlug] = useState('');
    const [eventCaption, setEventCaption] = useState('');
    const [eventFrame, setEventFrame] = useState<string>('');
    const [eventIsPublic, setEventIsPublic] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    const router = useRouter();

    const {mutate, isError, isSuccess, error: mutateError} = useInsertEntry();
    const {session} = useSession();

    const changeEventName = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventName(event.target.value), []);
    const changeEventCaption = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setEventCaption(event.target.value), []);
    const changeEventFramePath = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setEventFrame(e.target?.result as string ?? '');
            reader.readAsDataURL(file);
        }
    }, []);

    const changeEventIsPublic = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventIsPublic(event.target.checked), []);
    const changeEventEndsAt = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventEndsAt(event.target.value), []);
    const changeEventSlug = useCallback((event: ChangeEvent<HTMLInputElement>) => setEventSlug(event.target.value), []);

    const handleSubmit = useCallback((e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        setValidated(true);
        if (!form.checkValidity()) {
            e.stopPropagation();
            return;
        }

        // yuck
        let slug = eventSlug;

        if (eventSlug === '') {
            // get the first 20 alphanumeric characters of the event name
            slug = eventName
                .replace(/ /g, '-')
                .replace(/[^a-zA-Z0-9\-]/g, '')
                .slice(0, 25)
                .toLowerCase();
        }

        const data = {
            name: eventName,
            caption: eventCaption,
            frame: eventFrame,
            public: eventIsPublic,
            ends_at: eventEndsAt,
            slug: slug,
            created_at: new Date().toISOString(),
            user_id: session!.user!.id,
        };

        mutate(data);
    }, [eventSlug, eventName, eventCaption, eventFrame, eventIsPublic, eventEndsAt, session, mutate]);

    useEffect(() => {
        if (isError) {
            setError(mutateError?.message ?? 'An unknown error occurred');
        }

        if (isSuccess) {
            router.push('/events');
        }
    }, [isError, isSuccess, mutateError, router]);

    return <Content>
        <h1>Create an Event</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {isError && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formEventName" className="mb-3 required">
                <Form.Label>Event Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter event name" onChange={changeEventName}/>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid event name.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEventEnd" className="mb-3 d-flex flex-column">
                <Form.Label>Ends at</Form.Label>
                <Form.Control type="datetime-local" placeholder="Enter event end date" onChange={changeEventEndsAt}/>
            </Form.Group>

            <Form.Group controlId="formEventCaption" className="mb-3 required">
                <Form.Label>Event Caption</Form.Label>
                <Form.Control required as="textarea" rows={3} placeholder="Enter event caption"
                              onChange={changeEventCaption}/>
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

                {eventFrame && <Image fluid src={eventFrame} alt="frame"/>}
            </Form.Group>

            <Form.Group controlId="formEventIsPublic" className="mb-3">
                <Form.Check type="checkbox" label="Show event publicly" checked={eventIsPublic}
                            onChange={changeEventIsPublic}/>
            </Form.Group>

            <Form.Group controlId="formEventSlug" className="mb-3">
                <Form.Label>Custom URL</Form.Label>
                <Form.Control type="text" placeholder="Enter custom URL" onChange={changeEventSlug}/>
                <Form.Text className="text-muted">
                    If left blank, a random URL will be generated.
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </Content>;
};