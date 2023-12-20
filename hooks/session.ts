import { client } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

export function useSession() {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        client.auth.onAuthStateChange((event, session) => {
            setIsLoading(false);
            setSession(session);
        });
    }, []);

    return { isLoading, session, client };
}
