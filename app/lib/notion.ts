import { Client } from '@notionhq/client';

// ===== ENV =====
const NOTION_TOKEN = process.env.NOTION_TOKEN;
export const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID!;
export const SOCIAL_IMPACT_DATABASE_ID = process.env.NOTION_SOCIAL_IMPACT_DATABASE_ID!;

// ===== TYPES =====
export interface BlogPost {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  category: string;
  date: string;
  status: string;
  cover: string | null;
}

export interface SocialImpact {
  id: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  categoryId: string;
  categoryEn: string;
  cover: string | null;
  order: number;
}

// ===== HELPERS =====
function createClient() {
  return new Client({ auth: NOTION_TOKEN });
}

function parseCoverUrl(props: any, page: any): string | null {
  return (
    props.Cover?.url ??
    props.Cover?.files?.[0]?.file?.url ??
    props.Cover?.files?.[0]?.external?.url ??
    page.cover?.external?.url ??
    page.cover?.file?.url ??
    null
  );
}

function mapToBlogPost(page: any): BlogPost {
  const props = page.properties;
  return {
    id: page.id,
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? '',
    titleId: props.Title?.title?.[0]?.plain_text ?? '',
    titleEn: props['Title EN']?.rich_text?.[0]?.plain_text ?? props.Title?.title?.[0]?.plain_text ?? '',
    excerptId: props['Excerpt ID']?.rich_text?.[0]?.plain_text ?? '',
    excerptEn: props['Excerpt EN']?.rich_text?.[0]?.plain_text ?? '',
    contentId: props['Content ID']?.rich_text?.[0]?.plain_text ?? '',
    contentEn: props['Content EN']?.rich_text?.[0]?.plain_text ?? '',
    category: props.Category?.select?.name ?? '',
    date: props.Date?.date?.start ?? '',
    status: props.Status?.select?.name ?? '',
    cover: parseCoverUrl(props, page),
  };
}

// ===== QUERIES =====
export async function getBlogPosts(): Promise<BlogPost[]> {
  const notion = createClient();
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: 'Status', select: { equals: 'Published' } },
    sorts: [{ property: 'Date', direction: 'descending' }],
  });
  return response.results.map(mapToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Fetch semua published lalu filter di sini karena Notion SDK v2
  // tidak support rich_text filter dengan cara yang reliable
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug) ?? null;
}

export async function getSocialImpacts(): Promise<SocialImpact[]> {
  const notion = createClient();
  const response = await notion.databases.query({
    database_id: SOCIAL_IMPACT_DATABASE_ID,
    filter: { property: 'Status', select: { equals: 'Published' } },
    sorts: [{ property: 'Order', direction: 'ascending' }],
  });
  return response.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      titleId: props.Title?.title?.[0]?.plain_text ?? '',
      titleEn: props['Title EN']?.rich_text?.[0]?.plain_text ?? props.Title?.title?.[0]?.plain_text ?? '',
      descId: props['Description ID']?.rich_text?.[0]?.plain_text ?? '',
      descEn: props['Description EN']?.rich_text?.[0]?.plain_text ?? '',
      categoryId: props['Category ID']?.rich_text?.[0]?.plain_text ?? '',
      categoryEn: props['Category EN']?.rich_text?.[0]?.plain_text ?? '',
      cover: parseCoverUrl(props, page),
      order: props.Order?.number ?? 0,
    };
  });
}