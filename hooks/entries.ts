import {useMutation, useQuery} from "@tanstack/react-query";
import {client} from "@/utils/supabase";
import {Tables} from "@/database";

export function useGetEntries() {
    return useQuery({
        queryKey: ["entries"],
        queryFn: async () => {
            const {data, error} = await client
                .from("entries_with_display_name")
                .select("*")
                .filter("public", "eq", true)
                .order("created_at", {ascending: false});

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useGetEntry(slug: string) {
    return useQuery({
        queryKey: ["entries", slug],
        queryFn: async () => {
            const {data, error} = await client
                .from("entries_with_display_name")
                .select("*")
                .filter("slug", "eq", slug)
                .single();

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useGetUserEntries(userId: string) {
    return useQuery({
        queryKey: ["entries", userId],
        queryFn: async () => {
            const {data, error} = await client
                .from("entries_with_display_name")
                .select("*")
                .filter("user_id", "eq", userId)
                .order("created_at", {ascending: false});

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useInsertEntry() {
    return useMutation({
        mutationFn: async (entry: Tables<"entries">) => {
            const {data, error} = await client.from("entries").insert(entry);

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useUpdateEntry() {
    return useMutation({
        mutationFn: async (entry: Tables<"entries">) => {
            const {data, error} = await client.from("entries").update(entry);

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useDeleteEntry() {
    return useMutation({
        mutationFn: async (entry: Tables<"entries">) => {
            const {data, error} = await client.from("entries").delete().match({slug: entry.slug});

            if (error) {
                throw error;
            }

            return data;
        }
    });
}