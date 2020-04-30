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
  let files = Object.values(requestFiles)[0];
  if (!Array.isArray(files)) files = [files];

  return files.map((file) => {
    const tmpName = file.name.split('.');
    tmpName.splice(tmpName.length - 1, 1);
    return {
      path: file.tempFilePath,
      name: tmpName.join(''),
    };
  });
};

app.post('/upload', async (req, res) => {
  const filePaths = getFilePathsFromRequest(req.files);
  const folderName = req.query.folder;
  try {
    const pArr$ = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, folderName)
    );
    const result = await Promise.all(pArr$);
    const data = result.map(({ secure_url, format, resource_type }) => ({
      secure_url,
      format,
      resource_type,
    }));
    res.status(200).json({
      msg: 'Image Uploaded',
      error: false,
      data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message || error || 'Image Upload Error',
      error: true,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
