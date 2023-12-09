import React from "react";
import {Navbar} from "@/components/navbar";

export function Content({children}: { children: React.ReactNode }) {
    return <div className="d-flex flex-column min-vh-100">
        <Navbar/>
        <main className="flex-grow-1 d-flex flex-column container pt-4">
            {children}
        </main>
    </div>;
}