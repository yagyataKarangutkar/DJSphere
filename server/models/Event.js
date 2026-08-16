import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please add an event time'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Please add a venue'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please add maximum participants'],
    },
    clubName: {
      type: String,
      required: [true, 'Please add a club name'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
