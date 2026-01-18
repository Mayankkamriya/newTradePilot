import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
  fileBase64: string,
  folder = "tradepilot/completions"
) {
  const result = await cloudinary.uploader.upload(fileBase64, {
    folder,
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    name: result.original_filename,
    size: result.bytes,
  };
}
