import { model, Schema } from 'mongoose';

const schema = new Schema({
  _id: String,
  guild: String,
  watch: {
    type: Boolean,
    default: true
  }
});

export default model('channels', schema);
