'use client';

import { useSession } from '@/hooks/session';
import { useRouter } from 'next/navigation';
import { Content } from '@/components/content';

export default function Profile() {
    const { isLoading, session } = useSession();

    const router = useRouter();

    if (isLoading) {
        return (
            <Content>
                <h1>Loading...</h1>
            </Content>
        );
    }

    if (session === null) {
        return router.push('/login');
    }

    return (
        <Content>
            <h1>Profile</h1>
        </Content>
    );
}
