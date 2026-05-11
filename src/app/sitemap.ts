export default async function sitemap() {

  const res = await fetch(
    "https://refones.com/blogs/wp-json/wp/v2/posts"
  );

  const posts = await res.json();

  const blogs = posts.map((post: any) => ({
    url: `https://refone.co.in/blog/${post.slug}`,
    lastModified: new Date(post.modified),
  }));

  return [
    {
      url: "https://refone.co.in",
      lastModified: new Date(),
    },

    ...blogs,
  ];
}