import { client } from '@/utils/supabase';
import SlugComponent from '@/components/slugComponent';

type Props = {
    params: {
        slug: string;
    };
};

export default function Slug({ params: { slug } }: Props) {
    return <SlugComponent slug={slug} />;
}

export async function generateMetadata({ params: { slug } }: Props) {
    const { data, error } = await client
        .from('events')
        .select('name, caption, frame')
        .eq('slug', slug)
        .limit(1)
        .single();

    if (error) {
        return {
            title: 'Error | dpBoom!',
            description: error.message
        };
    }

    if (!data) {
        return {
            title: 'Not Found | dpBoom!',
            description: 'Event not found'
        };
    }

    return {
        title: `${data.name} | dpBoom!`,
        description: data.caption,
        openGraph: {
            images: [data.frame]
        }
    };
}
