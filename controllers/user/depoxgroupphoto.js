const { Dropbox } = require("dropbox");
const Jimp = require("jimp");
const signupTable = require("../../model/user");
const dotenv=require("dotenv");
const groupsTable = require("../../model/group");
dotenv.config()
// Configure Dropbox
const dbx = new Dropbox({
  accessToken:process.env.DROPBOX_ACCESS_TOKEN

});

// Handle file upload
const dropboxuploadGroupPhotoController = async (req, res) => {
  const fileData = req.file;

  if (!fileData) {
    console.error("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Load the image using jimp
    const image = await Jimp.read(fileData.buffer);

    // Resize the image
    image.resize(52,52);

    // Get the image buffer
    const resizedImageBuffer = await image.getBufferAsync(Jimp.AUTO);

    const fileExtension = fileData.originalname.split(".").pop();
    // Upload the resized image to Dropbox
    const filePath = `/chitchat/group/${new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")}.${fileExtension}`;
    console.log("Generated File Path:", filePath);


    
    const uploadResponse = await dbx.filesUpload({
      path: filePath,
      contents: resizedImageBuffer,
    });


    const fileMetadata = uploadResponse.result;

    // Get the shared link for the uploaded file with custom settings
    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: fileMetadata.path_display,
      settings: {
        requested_visibility: { ".tag": "public" },
      },
    });

    const sharedLink = linkResponse.result.url.replace("dl=0", "raw=1");
    console.log("Shared Link:", sharedLink);

    // Update user profileImage field
    const userData = await groupsTable.findOne({ where: { id: req.query.groupId } });
    const upresult = await userData.update({ groupImage: sharedLink });
    console.log(upresult);

    // Send the URL back to the client
    res.status(200).json({
      message: "File uploaded to Dropbox successfully",
      url: sharedLink,
    });
  } catch (error) {
    console.error("Error uploading file to Dropbox:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = dropboxuploadGroupPhotoController;
