import {client} from "@/utils/supabase";
import {useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";

export default function useSession() {
    const [session, setSession] = useState<Session | "loading" | null>("loading")

    useEffect(() => {
        client.auth.onAuthStateChange((event, session) => {
            setSession(session)
        });
    }, []);

    return { session, client }
}