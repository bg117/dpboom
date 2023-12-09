'use client';

import {Content} from "@/components/content";
import useSession from "@/hooks/useSession";
import {useRouter} from "next/navigation";

export default function Events() {
    const { session} = useSession()
    const router = useRouter();

    if (session === null) {
        router.push('/login');
    }

    return <Content>
        <h1>Events</h1>
    </Content>;
};