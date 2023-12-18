'use client';

import {Content} from "@/components/content";
import {useGetEvent} from "@/hooks/events";
import {Button, Col, FormControl, Image as Im, Row} from "react-bootstrap";
import {useCallback, useEffect, useMemo, useState} from "react";
import fileDownload from "js-file-download";

export default function Slug({params: {slug}}: { params: { slug: string } }) {
    const {data, isLoading, isError, error} = useGetEvent(slug);
    const [imgSrc, setImgSrc] = useState<string>(data?.frame ?? '');
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const canvas = useMemo(() => document.createElement('canvas'), []);
    const ctx = useMemo(() => canvas.getContext('2d'), [canvas]);
    const frame = useMemo(() => {
        const img = new Image();
        img.src = data?.frame!;
        return img;
    }, [data]);
    const copyClick = useCallback(async () => {
        await navigator.clipboard.writeText(data!.caption!);
    }, [data]);
    const uploadClick = useCallback((e: any) => {
        // show file dialog
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target!.result as string;
                setImg(img);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, []);
    const downloadClick = useCallback(() => {
        fileDownload(imgSrc, `${data!.name}.png`);
    }, [data, imgSrc]);

    useEffect(() => {
        canvas.width = frame.width;
        canvas.height = frame.height;

        if (!img) {
            return;
        }

        // draw img in the center of the canvas
        const x = (frame.width - img.width) / 2;
        const y = (frame.height - img.height) / 2;
        // zoom img to fit frame
        const scale = Math.max(frame.width / img.width, frame.height / img.height);
        // draw img on canvas
        ctx!.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);
        // draw frame on top of img
        ctx!.drawImage(frame, 0, 0);

        setImgSrc(canvas.toDataURL());
    }, [canvas, ctx, frame, img]);

    useEffect(() => {
        setImgSrc(data?.frame ?? '');
    }, [data]);

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

    return <Content>
        <h1>{data!.name}</h1>

        {/* readonly textarea filled with caption with copy button */}
        <Row className="g-2">
            <Col md={8}>
                <div className="flex-grow-1">
                    <FormControl as="textarea" readOnly value={data!.caption!} className="mb-2" rows={10}/>
                    <Button variant="outline-secondary" onClick={copyClick}>Copy</Button>
                </div>
            </Col>

            <Col md={4}>
                <Im fluid src={imgSrc} className="mb-2" alt="frame"/>
                <div className="d-flex gap-2 flex-column flex-sm-row">
                    <Button variant="secondary" className="w-100" onClick={uploadClick}>Upload</Button>
                    <Button variant="outline-secondary" className="w-100" disabled={!img} onClick={downloadClick}>
                        Download
                    </Button>
                </div>
            </Col>
        </Row>
    </Content>;
}