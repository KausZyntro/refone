import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const imageUrl =
    "https://refones.com/blogs/wp-content/uploads/" +
    path.join("/");

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response("Image not found", {
        status: response.status,
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
          "Content-Type":
            response.headers.get("content-type") || "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Failed to fetch image", {
      status: 500,
    });
  }
}