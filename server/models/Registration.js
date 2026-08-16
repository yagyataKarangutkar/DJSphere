import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please add a student name'],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, 'Please add a student email'],
      trim: true,
    },
    eventName: {
      type: String,
      required: [true, 'Please add an event name'],
      trim: true,
    },
    clubName: {
      type: String,
      required: [true, 'Please add a club name'],
      trim: true,
    },
    registeredOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
