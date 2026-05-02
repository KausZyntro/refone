export interface BlogPost {
  id: string | number;
  slug: string;
  title: any;
  excerpt: any;
  content?: any;
  coverImage?: string;
  author?: any;
  publishedAt?: string;
  category?: any;
  date?: string;
  _embedded?: any;
  yoast_head_json?: any;
  jetpack_featured_media_url?: string;
  [key: string]: any;
}
