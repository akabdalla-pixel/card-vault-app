import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL)

export async function uploadImage(base64, publicId) {
  const result = await cloudinary.uploader.upload(base64, {
    public_id: publicId,
    overwrite: true,
    transformation: [{ width: 400, height: 587, crop: 'fit' }],
    format: 'jpg',
  })
  return result.secure_url
}

export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary
