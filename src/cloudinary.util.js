const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'jassi',
  api_key: process.env.CLOUDINARY_API_KEY || '848377833547884',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'iGRqMMV7p_NBrwPNjgnbuDGbj5M',
});

const options = (name, folderName = 'heroku_server') => ({
  public_id: `${folderName}/${name}`,
  overwrite: true,
  // notification_url: 'https://mysite.example.com/notify_endpoint',
});

const uploadToCloudinary = async ({ path, name }, folderName) => {
  const opts = options(name, folderName);
  try {
    return await cloudinary.uploader.upload(path, opts);
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    // ERROR FOR USER
    throw new Error(`${name} upload error:`);
  }
};

module.exports = { uploadToCloudinary };
