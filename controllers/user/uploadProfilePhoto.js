
const Jimp = require("jimp");
const signupTable = require("../../model/user");
const dotenv=require("dotenv")



const { BlobServiceClient } = require("@azure/storage-blob");
dotenv.config()

async function uploadFileToBlob(filename, image) {
  const connectionString = process.env.CONNECTIONSTRING;
  const containerName = process.env.CONTAINER_NAME;

  const blobName = filename;

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const contentLength = Buffer.from(image).length;

  await blockBlobClient.upload(image, contentLength);
  return blockBlobClient.url;
}

uploadFileToBlob().catch((error) => {
  console.error("Error uploading file:", error.message);
});

// Handle file upload
const uploadProfilePhotoController = async (req, res) => {
  const fileData = req.file;

  if (!fileData) {
   
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Load the image using jimp
    const image = await Jimp.read(fileData.buffer);

    // Resize the image
    image.resize(40,45);

    // Get the image buffer
    const resizedImageBuffer = await image.getBufferAsync(Jimp.AUTO);

    const fileExtension = fileData.originalname.split(".").pop();

    const filename = `group/${req.query.groupId}/${new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")}.${fileExtension}`;

    const fileUrl = await uploadFileToBlob(filename, resizedImageBuffer);


    // Update user profileImage field
    const userData = await signupTable.findOne({ where: { id: req.user.id } });
    const upresult = await userData.update({ profileImage: fileUrl});
  

    // Send the URL back to the client
    res.status(200).json({
      message: "File uploaded to Dropbox successfully",
      url: fileUrl,
    });
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error",msg:error });
  }
};

module.exports = uploadProfilePhotoController;
