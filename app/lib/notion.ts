import { Client } from '@notionhq/client';

export const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID!;

export interface BlogPost {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  category: string;
  date: string;
  status: string;
  cover: string | null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page: any) => {
    const props = page.properties;

    return {
      id: page.id,
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? '',
      titleId: props['Title ID']?.rich_text?.[0]?.plain_text ?? props.Title?.title?.[0]?.plain_text ?? '',
      titleEn: props['Title EN']?.rich_text?.[0]?.plain_text ?? props.Title?.title?.[0]?.plain_text ?? '',
      excerptId: props['Excerpt ID']?.rich_text?.[0]?.plain_text ?? '',
      excerptEn: props['Excerpt EN']?.rich_text?.[0]?.plain_text ?? '',
      category: props.Category?.select?.name ?? '',
      date: props.Date?.date?.start ?? '',
      status: props.Status?.select?.name ?? '',
      cover: page.cover?.external?.url ?? page.cover?.file?.url ?? null,
    };
  });
}