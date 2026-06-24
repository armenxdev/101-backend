const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const ALLOWED_IMAGE_TYPES = /^image\//;
const ALLOWED_VIDEO_TYPES = /^video\//;

const isAllowedMediaType = (mimetype) =>
  ALLOWED_IMAGE_TYPES.test(mimetype) || ALLOWED_VIDEO_TYPES.test(mimetype);

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'products',
        resource_type: options.resourceType || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

const uploadFiles = async (files, folder = 'products') => {
  const results = [];

  for (const file of files) {
    if (!isAllowedMediaType(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed.`);
    }

    const resourceType = ALLOWED_VIDEO_TYPES.test(file.mimetype) ? 'video' : 'image';
    const result = await uploadBuffer(file.buffer, { folder, resourceType });
    results.push({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  }

  return results;
};

const deleteByPublicId = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

const deleteMany = async (publicIds) => {
  await Promise.all(
    publicIds.map(({ publicId, resourceType }) => deleteByPublicId(publicId, resourceType))
  );
};

module.exports = {
  isAllowedMediaType,
  uploadBuffer,
  uploadFiles,
  deleteByPublicId,
  deleteMany,
};
