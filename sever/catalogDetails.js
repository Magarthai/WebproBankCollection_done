const mongoose = require("mongoose");

const CatalogsSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    from: String,
    rate: String,
    image:String,
    status: { type: String, default: "enable" }, // Set default value to "user"
    userId: String,
  },
  {
    collection: "CatalogInfo",
  }
);

mongoose.model("CatalogInfo", CatalogsSchema);