const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: { type: String, default: "user" },
    catalogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "CatalogInfo" }], // Array of catalog IDs
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsSchema);
