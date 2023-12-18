'use client'

import {useGetEvent} from "@/hooks/events";
import {useCallback, useEffect, useRef, useState} from "react";
import {Content} from "@/components/content";
import {Button, Col, FormControl, Image as Im, Row} from "react-bootstrap";

export default function SlugComponent({slug}: { slug: string}) {
    const {data, isLoading, isError, error} = useGetEvent(slug);
    const [imgSrc, setImgSrc] = useState<string>(data?.frame ?? '');
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [frame, setFrame] = useState<HTMLImageElement | null>(null);

    const canvasRef = useRef(document.createElement("canvas"));
    const inputRef = useRef(document.createElement("input"));
    const aRef = useRef(document.createElement("a"));
    const ctx = useRef(canvasRef.current.getContext('2d')!);

    const copyClick = useCallback(async () => {
        if (!data?.caption) {
            return;
        }

        await navigator.clipboard.writeText(data.caption);
    }, [data]);

    const inputOnChange = useCallback((e: any) => {
        const file = (e.target as HTMLInputElement).files![0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target!.result as string;
            setImg(img);
        };
        reader.readAsDataURL(file);
    }, []);

    const uploadClick = useCallback((e: any) => {
        // show file dialog
        e.preventDefault();
        inputRef.current?.click();
    }, []);

    const downloadClick = useCallback(() => {
        aRef.current?.click();
    }, []);

    inputRef.current.type = 'file';
    inputRef.current.accept = 'image/*';
    inputRef.current.hidden = true;
    inputRef.current.onchange = inputOnChange;

    aRef.current.hidden = true;
    aRef.current.download = 'frame.png';
    aRef.current.href = imgSrc;

    const setUp = useCallback(() => {
        if (!data?.frame) {
            return;
        }

        const f = new Image();
        f.src = data.frame;

        canvasRef.current.width = f.width;
        canvasRef.current.height = f.height;

        ctx.current.drawImage(f, 0, 0);

        setImgSrc(canvasRef.current.toDataURL());
        setFrame(f);
    }, [data]);

    const setUpImg = useCallback(() => {
        if (!frame || !img) {
            return;
        }

        // clear canvas
        ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // draw img in the center of the canvas
        const x = (frame.width - img.width) / 2;
        const y = (frame.height - img.height) / 2;
        // zoom img to fit frame
        const scale = Math.max(frame.width / img.width, frame.height / img.height);
        // draw img on canvas
        ctx.current.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);
        // draw frame on top of img
        ctx.current.drawImage(frame, 0, 0);

        setImgSrc(canvasRef.current.toDataURL());
    }, [img, frame]);

    useEffect(() => {
        setUp();
        setUpImg();
    }, [setUp, setUpImg]);

    if (isLoading) {
        return <Content>
            <h1>Loading...</h1>
        </Content>;
    }

    if (isError) {
        return <Content>
            <h1>Error</h1>
            <p>{error?.message}</p>
        </Content>;
    }

    if (!data) {
        return <Content>
            <h1>Not Found</h1>
            <p>The event you are looking for does not exist.</p>
        </Content>;
    }

    return <Content>
        <h1>{data.name}</h1>

        {/* readonly textarea filled with caption with copy button */}
        <Row className="g-4">
            <Col md={4}>
                <h6 className="text-muted">Frame</h6>

                <Im fluid src={imgSrc} alt="frame" className="mb-2"/>

                <div className="d-flex gap-2 flex-column flex-sm-row">
                    <Button variant="secondary" className="w-100" onClick={uploadClick}>Upload</Button>
                    <Button variant="outline-secondary" className="w-100" disabled={!img} onClick={downloadClick}>
                        Download
                    </Button>
                </div>
            </Col>
            <Col md={8} className="d-flex flex-column">
                <h6 className="text-muted">Caption</h6>
                <FormControl as="textarea" readOnly value={data!.caption!} className="mb-2" rows={10}/>
                <Button variant="outline-secondary" onClick={copyClick}>Copy</Button>
            </Col>
        </Row>
        <hr/>
        <h5>Share this Event</h5>
        <p>Share this event with your friends and family!</p>
        <div className="d-flex gap-2">
            <Button variant="outline-primary"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}>
                Facebook
            </Button>
            <Button variant="outline-primary"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data!.caption!)}&url=${encodeURIComponent(window.location.href)}`}>
                Twitter
            </Button>
        </div>
    </Content>;
}