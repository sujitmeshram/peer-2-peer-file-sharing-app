const router = require("express").Router();
const File = require("../models/file");

//
router.get("/:uuid", async (req, res) => {
  // Extract link and get file from storage send download stream
  const file = await File.findOne({ uuid: req.params.uuid });
  // Link expired
  if (!file) {
    return res.render("download", { error: "Link has been expired." }); //refering to download page if file not found
  }
  const response = await file.save();
  const filePath = `${__dirname}/../${file.path}`; //getting relative file path
  res.download(filePath); //sending file path which have to download
});

module.exports = router;
