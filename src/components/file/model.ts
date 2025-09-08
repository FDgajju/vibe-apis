import { model, Schema } from "mongoose";
import { MODEL_NAMES } from "../../constants";

const fileSchema = new Schema(
  {
    name: String,
    key: String,
    url: String,
    type: String,
    uploadedBy: String,
  },
  { timestamps: true }
);

const File = model(MODEL_NAMES.FILE, fileSchema);
export default File;
