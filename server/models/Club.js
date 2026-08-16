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
    logo: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'Technical Club',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    established: {
      type: Number,
      default: 2022,
    },
    openTo: {
      type: String,
      default: 'All Students',
    },
    aboutText: {
      type: String,
      default: '',
    },
    whatWeDo: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model('Club', clubSchema);
export default Club;
