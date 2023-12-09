import Link from "next/link";
import React from "react";
import {Content} from "@/components/content";

export default function Home() {
    return (
        <Content>
            <h1>dpBoom!</h1>
            <p>dpBoom! is a simple, easy to use, and free to use profile frame generator, designed to be
                a replacement for Twibbonize.</p>
            <Link className="btn btn-primary" href="/events">Get Started</Link>
        </Content>
    );
}