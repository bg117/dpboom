import {client} from "@/utils/supabase";
import SlugComponent from "@/components/slugComponent";

type Props = {
    params: {
        slug: string
    }
}

export default function Slug({params: {slug}}: Props) {
    return <SlugComponent slug={slug}/>;
}

export async function generateMetadata({params: {slug}}: Props) {
    const {data, error} = await client
        .from("events")
        .select("name, caption, frame")
        .eq("slug", slug)
        .limit(1)
        .single();

    if (error) {
        throw error;
    }

    return {
        title: `${data!.name} | dpBoom!`,
        description: data!.caption,
        openGraph: {
            images: [
                {
                    url: data!.frame,
                    width: 1200,
                    height: 630,
                    alt: data!.name,
                },
            ]
        }
    };
}

