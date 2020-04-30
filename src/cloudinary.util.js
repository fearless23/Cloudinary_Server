const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'jassi', 
  api_key: '848377833547884', 
  api_secret: 'iGRqMMV7p_NBrwPNjgnbuDGbj5M' 
});

const uploadToCloudinary = (file) => {
  const p = new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
  return p;
};

module.exports = { uploadToCloudinary };
