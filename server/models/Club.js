import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a club name'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please add a club type'],
      trim: true,
    },
    members: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model('Club', clubSchema);
export default Club;
