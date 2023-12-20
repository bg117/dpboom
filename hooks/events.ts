import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '@/utils/supabase';
import { Database, Tables } from '@/database';

type EventTable = Database['public']['Tables']['events'];
type EventWithDisplayName = EventTable['Row'] & { display_name: string };
type EventInsert = EventTable['Insert'];
type EventUpdate = EventTable['Update'];

export function useGetEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data, error } = await client
                .from('events_with_display_name')
                .select('*')
                .filter('public', 'eq', true)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // make members of data non-nullable
            return data as EventWithDisplayName[] | null;
        }
    });
}

export function useGetEvent(slug: string) {
    return useQuery({
        queryKey: ['events', slug],
        queryFn: async () => {
            const { data, error } = await client
                .from('events_with_display_name')
                .select('*')
                .filter('slug', 'eq', slug)
                .limit(1)
                .single();

            if (error) {
                throw error;
            }

            return data as EventWithDisplayName | null;
        }
    });
}

export function useGetUserEvents(userId: string) {
    return useQuery({
        queryKey: ['events', userId],
        queryFn: async () => {
            const { data, error } = await client
                .from('events_with_display_name')
                .select('*')
                .filter('user_id', 'eq', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data as EventWithDisplayName[] | null;
        }
    });
}

export function useInsertEvent() {
    return useMutation({
        mutationFn: async (entry: EventInsert) => {
            const { data, error } = await client.from('events').insert(entry);

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useUpdateEvent() {
    return useMutation({
        mutationFn: async (entry: EventUpdate) => {
            const { data, error } = await client.from('events').update(entry);

            if (error) {
                throw error;
            }

            return data;
        }
    });
}

export function useDeleteEvent() {
    return useMutation({
        mutationFn: async (entry: EventWithDisplayName) => {
            const { data, error } = await client
                .from('events')
                .delete()
                .match({ slug: entry.slug });

            if (error) {
                throw error;
            }

            return data;
        }
    });
}
