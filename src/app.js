const express = require('express');
const filesUpload = require('express-fileupload');
const { uploadToCloudinary } = require('./cloudinary.util');
const app = express();
app.use(
  filesUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to Cloudinary Server', error: false });
});

const getFilePathsFromRequest = (requestFiles) => {
  const files = Object.values(requestFiles)[0];
  if (Array.isArray(files)) return files.map((file) => file.tempFilePath);
  return [files.tempFilePath];
};

app.post('/upload', async (req, res) => {
  const filePaths = getFilePathsFromRequest(req.files);
  try {
    const pArr$ = filePaths.map((filePath) => uploadToCloudinary(filePath));
    const data = await Promise.all(pArr$);
    res.json({ msg: 'Image Uploaded', error: false, data });
  } catch (error) {
    res.json({
      msg: error.message || error || 'Image Upload Error',
      error: true,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
