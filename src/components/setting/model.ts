import { model, Schema } from "mongoose";
import { MODEL_NAMES } from "../../constants";

const settingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
  },

  isPrivateAccount: { type: Boolean, default: false },
  mfa: { type: Boolean, default: false },
});

const Setting = model(MODEL_NAMES.SETTING, settingSchema);

export default Setting;
