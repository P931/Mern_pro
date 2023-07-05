const express = require('express')
const router = express.Router();
const multer = require("multer")
const user = require("../models/User")
const csv = require('fast-csv')
const fs = require('fs')
const URL = process.env.BASE_URL

// fs is file System


const imgconfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}. ${file.originalname}`)
  }
})

const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new Error("only images is allowed"))
  }
}

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage
})

// Create User 
router.post("/registration", upload.single("Profile"), async (req, res) => {

  const { FirstName, LastName, Email, Mobile, Gender, Status, Location } = req.body
  const Profile = req.file.filename

  console.log("req.file.filename is :- ", req.file.filename)

  if (!FirstName || !LastName || !Email || !Mobile || !Gender || !Status || !Profile || !Location) {
    res.status(422).send("Please, first fill all Field")
  }

  if (!req.file) {
    res.status(422).send("No Image file is uploaded")
  }

  try {

    // const presentUser = await user.findOne({ Email: Email })
    // console.log("presentUser is  :- ", presentUser)

    // if (presentUser) {
    //   res.status(422).send("User is already Present add another user")
    // } else {
    const addUser = new user({
      FirstName,
      LastName,
      Email,
      Mobile,
      Gender,
      Status,
      Profile,
      Location
    })
    await addUser.save();
    res.status(201).json(addUser)
    // res.json(addUser)
    console.log("addUser is :- ", addUser)
    // }
  } catch (error) {
    res.send(error)
  }

})

// Get All User 
router.get("/getUserData", async (req, res) => {
  try {

    const userData = await user.find()
    // const userData = await user.findById()
    console.log("userData is :- ", userData)
    res.status(201).json({ userData })

  } catch (error) {
    console.log("error in getUserData is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }
})

// Get Individual User By Id 
router.get("/getIndividualUser/:id", async (req, res) => {

  try {

    console.log(req.params)
    const { id } = req.params

    const IndividualUser = await user.findById({ _id: id })
    console.log("IndividaulUser is :- ", IndividualUser)
    res.status(201).json({ IndividualUser, message: "Get Individual User Successfully" })

  } catch (error) {
    console.log("Error userIndividual is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }
})

// Update User By Id
router.patch("/updateUser/:id", async (req, res) => {

  try {

    const { id } = req.params

    const updateUser = await user.findByIdAndUpdate(id, req.body, {
      new: true
    })
    console.log("updateUser is :- ", updateUser)
    res.status(201).json({ updateUser, message: "User Data update SuccessfUlly" })

  } catch (error) {
    console.log("updateUser Error is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }
})


// Delete User By Id
router.delete("/deleteUser/:id", async (req, res) => {

  try {

    const { id } = req.params

    const deleteUser = await user.findByIdAndDelete({ _id: id })
    console.log("DeleteUser is :- ", deleteUser)
    res.status(201).json({ deleteUser, message: "Delete User SuccessFully" })

  } catch (error) {
    console.log("Delete user Error is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }

})

// Search User FullName 
router.get("/search", async (req, res) => {

  // here $options is capital and small letter both

  try {

    const query = req.query.searchQuery || "";
    const userSearch = await user.find({ FirstName: { $regex: query, $options: "i" } })
    res.status(201).json({ userSearch, message: "Search User SuccessFully" })

  } catch (error) {
    console.log("Search User Error is :- ", error)
    // res.status(422).json(error)
    res.json(error)
  }
})

// Export Csv file
router.get('/userExport', async (req, res) => {

  try {

    const userExportData = await user.find()
    console.log("userExportData is :- ", userExportData)

    const csvStream = csv.format({ headers: true })

    if (!fs.existsSync("public/files/export")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/")
      }

      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export")
        // fs.mkdir("./public/files/export")
      }
    }

    const writablestream = fs.createWriteStream(
      "public/files/export/users.csv"
    )

    csvStream.pipe(writablestream)

    writablestream.on("finish", () => {
      res.status(201).json({
        // downloadUrl: `http://localhost:8000/files/export/users.csv`
        downloadUrl: `${URL}/files/export/users.csv`
      })
    })

    if (userExportData.length > 0) {
      userExportData.map((user) => {
        csvStream.write({
          FirstName: user.FirstName ? user.FirstName : "-",
          LastName: user.LastName ? user.LastName : "-",
          Email: user.Email ? user.Email : "-",
          Mobile: user.Mobile ? user.Mobile : "-",
          Gender: user.Gender ? user.Gender : "-",
          Status: user.Status ? user.Status : "-",
          Profile: user.Profile ? user.Profile : "-",
          Location: user.Location ? user.Location : "-",
        })
      })
    }

    csvStream.end()
    writablestream.end()

  } catch (error) {
    console.log("userExport Error is :- ", error)
    res.json(error)
  }
})


module.exports = router;