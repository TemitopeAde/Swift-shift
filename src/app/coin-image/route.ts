import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request: Request) {
  try {
    const urls = new URL(request.url);
    const coinId = urls.searchParams.get("id");
    
    const url = `https://sideshift.ai/api/v2/coins/icon/${coinId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.error();
    }

    const contentType = response.headers.get("Content-Type");
    const imageBuffer = await response.arrayBuffer();

    // Convert the image buffer to a base64 string
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageDataUrl = `data:${contentType};base64,${base64Image}`;

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageDataUrl, {
      resource_type: "image"
    });

    return NextResponse.json(
      { url: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error();
  }
}
