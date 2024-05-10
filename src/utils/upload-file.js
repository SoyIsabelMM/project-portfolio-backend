const { put } = require('@vercel/blob');

const uploadFile = async ({ userId, fileType, file }) => {
  try {
    const blob = await put(`${userId}_${fileType}`, file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.mimetype,
    });

    const date = new Date();
    return `${blob.url}?d=${date.getTime()}`;
  } catch (error) {
    console.error(err);

    throw new Error('Error uploading file');
  }
};

module.exports = {
  uploadFile,
};
