import { model, Schema } from 'mongoose';

const schema = new Schema({
  _id: String,
  user: {
    type: String,
    required: true
  },
  guild: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    default: 0,
    required: true
  },
  type: {
    type: Number,
    default: 0,
    required: true
  }
});

export default model('threads', schema);
