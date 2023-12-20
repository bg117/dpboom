'use client';

import { useGetEvent } from '@/hooks/events';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Content } from '@/components/content';
import { Button, Col, FormControl, Image as Im, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretLeft,
    faCaretRight,
    faCaretUp,
    faMaximize,
    faMinimize,
    faRotateLeft,
    faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useCopyToClipboard } from '@/hooks/copy';

type ImageControlComponentProps = {
    onMoveLeftClick: () => void;
    onMoveUpClick: () => void;
    onMoveDownClick: () => void;
    onMoveRightClick: () => void;
    onRotateLeftClick: () => void;
    onRotateRightClick: () => void;
    onZoomInClick: () => void;
    onZoomOutClick: () => void;
};

type ImageDisplayComponentProps = {
    src: string;
    ImageControlComponentProps: ImageControlComponentProps;
    onUploadClick: () => void;
    onDownloadClick: () => void;
};

export default function SlugComponent({ slug }: { slug: string }) {
    const dOffset = 50;
    const dRotate = 15;
    const dScale = 0.1;

    const { data, isLoading, isError, error } = useGetEvent(slug);
    const { hasCopied, copy } = useCopyToClipboard();
    const [imgSrc, setImgSrc] = useState<string>(data?.frame ?? '');
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [frame, setFrame] = useState<HTMLImageElement | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetTop, setOffsetTop] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [scaleFactor, setScaleFactor] = useState(0);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const copyClick = useCallback(() => {
        copy(data!.caption!);
    }, [copy, data]);

    const inputOnChange = useCallback((e: Event) => {
        const file = (e.target as HTMLInputElement).files![0];
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.src = e.target!.result as string;
            img.onload = () => {
                setOffsetLeft(0);
                setOffsetTop(0);
                setRotate(0);
                setImg(img);
            };
        };
        reader.readAsDataURL(file);
    }, []);

    const uploadClick = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.hidden = true;
        input.onchange = inputOnChange;
        input.click();
    }, [inputOnChange]);

    const downloadClick = useCallback(() => {
        const a = document.createElement('a');
        a.hidden = true;
        a.download = '';
        a.href = imgSrc;
        a.click();
    }, [imgSrc]);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        setCanvas(canvas);
        setCtx(ctx);
    }, []);

    useEffect(() => {
        if (!data?.frame || !canvas || !ctx) {
            return;
        }

        const f = new Image();
        f.src = data.frame;
        f.onload = () => {
            canvas.width = f.width;
            canvas.height = f.height;

            ctx.drawImage(f, 0, 0);

            setImgSrc(canvas.toDataURL());
            setFrame(f);
        };
    }, [data, canvas, ctx]);

    useEffect(() => {
        if (!frame || !img || !canvas || !ctx) {
            return;
        }

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw img in the center of the canvas
        const x = (frame.width - img.width) / 2 + offsetLeft;
        const y = (frame.height - img.height) / 2 + offsetTop;
        const centerX = frame.width / 2;
        const centerY = frame.height / 2;
        // zoom img to fit frame
        const scale =
            Math.max(frame.width / img.width, frame.height / img.height) +
            scaleFactor;
        // draw img on canvas
        ctx.save();
        ctx.translate(centerX, centerY); // translate to center of canvas
        ctx.rotate((rotate * Math.PI) / 180); // rotate by radians
        ctx.scale(scale, scale); // scale
        ctx.translate(-centerX, -centerY); // translate back
        ctx.drawImage(img, x, y); // draw img
        ctx.restore();

        // draw frame on top of img
        ctx.drawImage(frame, 0, 0);

        const dataURL = canvas.toDataURL();
        if (dataURL !== imgSrc) {
            setImgSrc(dataURL);
        }
    }, [
        frame,
        img,
        imgSrc,
        offsetLeft,
        offsetTop,
        rotate,
        scaleFactor,
        canvas,
        ctx
    ]);

    const moveOffset = useCallback(
        (x: number, y: number) => {
            setOffsetLeft(offsetLeft + x);
            setOffsetTop(offsetTop + y);
        },
        [offsetLeft, offsetTop]
    );

    const rotateOffset = useCallback(
        (r: number) => {
            setRotate(rotate + r);
        },
        [rotate]
    );

    const zoomOffset = useCallback(
        (s: number) => {
            setScaleFactor(scaleFactor + s);
        },
        [scaleFactor]
    );

    const moveLeftClick = useCallback(
        () => moveOffset(-dOffset, 0),
        [moveOffset]
    );
    const moveUpClick = useCallback(
        () => moveOffset(0, -dOffset),
        [moveOffset]
    );
    const moveDownClick = useCallback(
        () => moveOffset(0, dOffset),
        [moveOffset]
    );
    const moveRightClick = useCallback(
        () => moveOffset(dOffset, 0),
        [moveOffset]
    );
    const rotateLeftClick = useCallback(
        () => rotateOffset(-dRotate),
        [rotateOffset]
    );
    const rotateRightClick = useCallback(
        () => rotateOffset(dRotate),
        [rotateOffset]
    );
    const zoomInClick = useCallback(() => zoomOffset(dScale), [zoomOffset]);
    const zoomOutClick = useCallback(() => zoomOffset(-dScale), [zoomOffset]);

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
                <h1>Not Found</h1>
                <p>The event you are looking for does not exist.</p>
            </Content>
        );
    }

    return (
        <Content>
            <h1>{data.name}</h1>

            {/* readonly textarea filled with caption with copy button */}
            <Row className="g-4">
                <Col md={4}>
                    <h6 className="text-muted">Frame</h6>
                    <ImageDisplayComponent
                        src={imgSrc}
                        ImageControlComponentProps={{
                            onMoveLeftClick: moveLeftClick,
                            onMoveUpClick: moveUpClick,
                            onMoveDownClick: moveDownClick,
                            onMoveRightClick: moveRightClick,
                            onRotateLeftClick: rotateLeftClick,
                            onRotateRightClick: rotateRightClick,
                            onZoomInClick: zoomInClick,
                            onZoomOutClick: zoomOutClick
                        }}
                        onUploadClick={uploadClick}
                        onDownloadClick={downloadClick}
                    />
                </Col>
                <Col md={8} className="d-flex flex-column">
                    <h6 className="text-muted">Caption</h6>
                    <FormControl
                        as="textarea"
                        readOnly
                        value={data.caption!}
                        className="mb-2"
                        rows={10}
                    />
                    <Button variant="outline-secondary" onClick={copyClick}>
                        {hasCopied ? 'Copied!' : 'Copy'}
                    </Button>
                </Col>
            </Row>
            <hr />
            <div>
                <h5>Share this Event</h5>
                <p>Share this event with your friends and family!</p>
                <SocialMediaComponent />
            </div>
        </Content>
    );
}

function ImageControlComponent(props: ImageControlComponentProps) {
    const {
        onMoveLeftClick: moveLeftClick,
        onMoveUpClick: moveUpClick,
        onMoveDownClick: moveDownClick,
        onMoveRightClick: moveRightClick,
        onRotateLeftClick: rotateLeftClick,
        onRotateRightClick: rotateRightClick,
        onZoomInClick: zoomInClick,
        onZoomOutClick: zoomOutClick
    } = props;

    return (
        <>
            <Row className="g-1">
                <Col>
                    <Button
                        variant="secondary"
                        className="w-100"
                        onClick={moveLeftClick}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="secondary"
                        className="w-100"
                        onClick={moveUpClick}
                    >
                        <FontAwesomeIcon icon={faCaretUp} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="secondary"
                        className="w-100"
                        onClick={moveDownClick}
                    >
                        <FontAwesomeIcon icon={faCaretDown} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="secondary"
                        className="w-100"
                        onClick={moveRightClick}
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </Button>
                </Col>
            </Row>
            <Row className="g-1">
                <Col>
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={rotateLeftClick}
                    >
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={rotateRightClick}
                    >
                        <FontAwesomeIcon icon={faRotateRight} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={zoomInClick}
                    >
                        <FontAwesomeIcon icon={faMaximize} />
                    </Button>
                </Col>
                <Col>
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={zoomOutClick}
                    >
                        <FontAwesomeIcon icon={faMinimize} />
                    </Button>
                </Col>
            </Row>
        </>
    );
}

function SocialMediaComponent() {
    return (
        <div className="d-flex gap-2">
            <Button
                variant="outline-primary"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                )}`}
            >
                <FontAwesomeIcon icon={faFacebook} />
            </Button>
            <Button
                variant="outline-primary"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href
                )}`}
            >
                <FontAwesomeIcon icon={faTwitter} />
            </Button>
        </div>
    );
}

function ImageDisplayComponent(props: ImageDisplayComponentProps) {
    const {
        src,
        ImageControlComponentProps,
        onUploadClick: uploadClick,
        onDownloadClick: downloadClick
    } = props;

    return (
        <>
            <Im fluid src={src} alt="frame" className="mb-2" />
            <div className="d-flex gap-2 flex-column">
                <ImageControlComponent {...ImageControlComponentProps} />
                <div className="d-flex gap-2 flex-column flex-sm-row">
                    <Button
                        variant="secondary"
                        className="w-100"
                        onClick={uploadClick}
                    >
                        Upload
                    </Button>
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={downloadClick}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </>
    );
}
