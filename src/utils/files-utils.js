const { put, del } = require('@vercel/blob');

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
    console.error(error);

    throw new Error('Error uploading file');
  }
};

const deleteFiles = async (filesUrl) => {
  if (filesUrl?.length) {
    try {
      await del(filesUrl);
    } catch (error) {
      console.error(error);

      throw new Error('Error deleting file');
    }
  }
};

module.exports = {
  uploadFile,
  deleteFiles,
};
