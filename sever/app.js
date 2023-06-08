const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODU5NzMyMjYsImV4cCI6MzYwMDAwMDAwMTY4NTk2OTQwMH0.QHoA4O9Y0zZ0ROdX8iw0a0cHzJD8r4AI8_D-9e-oOwI";

const mongoUrl =
  "mongodb+srv://Magar:Magar@satabatcluser.bq5tdsg.mongodb.net/userRegister?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./imageDetails");
require("./catalogDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");
const Catalogs = mongoose.model("CatalogInfo");

app.listen(5000, () => {
  console.log("Server started on port 5000");
});



app.post("/register", async (req, res) => {
  const { fname, lname, email, password, cpassword } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    const Passnotmatch = password !== cpassword;
    
    if (oldUser) {
      return res.json({ status: "us", error: "User Exists" });
    }
    if (Passnotmatch) {
      return res.json({ status: "fpass", error: "Password not match" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: "noacc", error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "60m",
    });
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({ status: "error", data: "User not found" });
    }

    res.send({ status: "ok", data: user });
  } catch (error) {
    res.send({ status: "error", data: error.message });
  }
});


app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" });
  } catch (error) {
    res.send({ Status: "error", data: error });
  }
});

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});

app.get("/getAllCatalog", async (req, res) => {
  try {
    const allCatalogs = await Catalogs.find({});
    res.send({ status: "get", data: allCatalogs });
  } catch (error) {
    console.log(error);
  }
});

app.get("/getEnableCatalog", async (req, res) => {
  try {
    const allCatalogs = await Catalogs.find({ status: "enable" });
    res.send({ status: "get", data: allCatalogs });
  } catch (error) {
    console.log(error);
  }
});



app.get("/getUnEnableCatalog", async (req, res) => {
  try {
    const unEnableCatalogs = await Catalogs.find({ status: "unenable" });
    res.send({ status: "get", data: unEnableCatalogs });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteCatalog", async (req, res) => {
  const { catalogid } = req.body;
  try {
    Catalogs.deleteOne({ _id: catalogid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "deleted", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.get("/paginatedApproveCatalog", async (req, res) => {
  const allCatalogs = await Catalogs.find({ status: "unenable" });
  const page = parseInt(req.query.page);
  const limits = parseInt(req.query.limit);

  const startIndex = (page - 1) * limits;
  const lastIndex = page * limits;

  const cresults = {};
  cresults.totalCatalog = allCatalogs.length;
  cresults.pageCount = Math.ceil(allCatalogs.length / limits);

  if (lastIndex < allCatalogs.length) {
    cresults.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    cresults.prev = {
      page: page - 1,
    };
  }
  cresults.result = allCatalogs.slice(startIndex, lastIndex);
  res.json(cresults);
});

app.get("/paginatedCatalog", async (req, res) => {
  const allCatalogs = await Catalogs.find({ status: "enable" });
  const page = parseInt(req.query.page);
  const limits = parseInt(req.query.limit);

  const startIndex = (page - 1) * limits;
  const lastIndex = page * limits;

  const cresults = {};
  cresults.totalCatalog = allCatalogs.length;
  cresults.pageCount = Math.ceil(allCatalogs.length / limits);

  if (lastIndex < allCatalogs.length) {
    cresults.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    cresults.prev = {
      page: page - 1,
    };
  }
  cresults.result = allCatalogs.slice(startIndex, lastIndex);
  res.json(cresults);
});

app.get("/paginatedUserCatalog", async (req, res) => {
  const { page, limit, userId } = req.query;
  const offset = (page - 1) * limit;

  const allCatalogs = await Catalogs.find({ userId: userId });
  const totalCount = await Catalogs.countDocuments({ userId: userId });

  const pageCount = Math.ceil(totalCount / limit);
  const paginatedCatalogs = allCatalogs.slice(offset, offset + limit);

  res.json({
    pageCount: pageCount,
    result: paginatedCatalogs,
  });
});


app.put("/updateCatalog", async (req, res) => {
  const { catalogid } = req.body;
  const updatePayload = req.body;

  try {
    const updatedCatalog = await Catalogs.findByIdAndUpdate(
      catalogid,
      updatePayload,
      { new: true }
    );

    if (!updatedCatalog) {
      return res
        .status(404)
        .send({ status: "failed", data: "Catalog not found" });
    }

    res.send({ status: "updated", data: updatedCatalog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", data: error.message });
  }
});

app.put("/updateCatalogStatus", async (req, res) => {
  const { catalogid, status } = req.body;

  try {
    const updatedCatalog = await Catalogs.findByIdAndUpdate(
      catalogid,
      { status },
      { new: true }
    );

    if (!updatedCatalog) {
      return res
        .status(404)
        .send({ status: "failed", data: "Catalog not found" });
    }

    res.send({ status: "updated", data: updatedCatalog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", data: error.message });
  }
});

app.put("/approveCatalog", async (req, res) => {
  const { catalogid } = req.body;
  Catalogs.findByIdAndUpdate(catalogid, { status: "enable" }, (err, doc) => {
    if (err) {
      res.json({ status: "Error", message: "Something went wrong" });
    } else {
      res.json({ status: "Success", message: "Catalog approved successfully" });
    }
  });
});

app.get("/getEnableCatalog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const catalog = await Catalogs.findOne({ _id: id, status: "enable" });
    if (catalog) {
      res.send({ status: "get", data: catalog });
    } else {
      res.send({ status: "notfound", data: null });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "error", data: null });
  }
});
app.post("/addcatalog", async (req, res) => {
  const { title,type, from, rate, base64 } = req.body;
  try {
    await Catalogs.create({
      title,
      type,
      from,
      rate,
      image: base64,
    });
    res.send({ status: "Added catalog" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/userrequest", async (req, res) => {
  const { title ,type, from, rate, base64, status = "unenable" } = req.body;
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const requestUserId = decoded.userId;

    await Catalogs.create({
      title,
      type,
      from,
      rate,
      image: base64,
      status,
      userId: requestUserId, // เก็บ userId ลงในฐานข้อมูล
    });

    res.send({ status: "Added catalog" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.get("/getUserId", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.send({ status: "success", userId: user._id });
    } else {
      res.send({ status: "error", message: "User not found" });
    }
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});

app.put("/updateCatalog", async (req, res) => {
  const { catalogid, title, type, from, rate } = req.body;
  try {
    await Catalogs.updateOne({ _id: catalogid }, { title ,type, from, rate });
    res.send({ status: "updated", data: "Updated" });
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", data: "Update failed" });
  }
});



app.post("/addCatalogIdToUserInfo", async (req, res) => {
  const { userId, catalogId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ status: "User not found" });
    }

    if (user.catalogIds.includes(catalogId)) {
      return res.json({ status: "Catalog ID already exists in UserInfo" });
    }

    if (catalogId) {
      user.catalogIds.push(catalogId);
      await user.save();
    }

    res.json({ status: "Catalog ID successfully added to UserInfo" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});







app.get("/userCatalog/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.send({ status: "error", data: "User not found" });
    }

    const catalogIds = user.catalogIds;

    const catalogs = await Catalogs.find({ _id: { $in: catalogIds } });

    res.send({ status: "ok", data: catalogs });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", data: null });
  }
});

app.post("/removeCatalogIdFromUserInfo", async (req, res) => {
  const { userId, catalogId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ status: "User not found" });
    }

    if (!user.catalogIds.includes(catalogId)) {
      return res.json({ status: "Catalog ID does not exist in UserInfo" });
    }

    await User.updateOne(
      { _id: userId },
      { $pull: { catalogIds: catalogId } }
    );

    res.json({ status: "Catalog ID successfully removed from UserInfo" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", error: error.message });
  }
});


app.get("/getUser/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.send({ status: "success", data: user });
    } else {
      res.send({ status: "error", message: "User not found" });
    }
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});
