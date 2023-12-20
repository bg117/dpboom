'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import './globals.scss';

const queryClient = new QueryClient();

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <html lang="en">
                <body>{children}</body>
            </html>
        </QueryClientProvider>
    );
}
