import mongoose from 'mongoose';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

export const seedDatabase = async () => {
  try {
    const clubCount = await Club.countDocuments();
    if (clubCount === 0) {
      console.log('Seeding database with mock DJSphere clubs...');
      await Club.insertMany([
        { name: 'DJS CodeAI', type: 'Club', members: 150 },
        { name: 'DJS CSI', type: 'Student Chapter', members: 120 },
        { name: 'DJS Synapse', type: 'Creative/Video Team', members: 80 },
        { name: 'DJS Unicode', type: 'Club', members: 100 },
        { name: 'DJS ACM SIGCHI', type: 'Student Chapter', members: 90 },
      ]);
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('Seeding database with mock DJSphere events...');
      const dummyCreatorId = new mongoose.Types.ObjectId('65d21a221f1d1d8c1c000000');
      await Event.insertMany([
        { 
          title: 'AI/ML Workshop', 
          description: 'Introduction to Artificial Intelligence and Machine Learning algorithms.',
          clubName: 'DJS CodeAI', 
          date: new Date('2026-08-24'), 
          time: '3:00 PM',
          venue: 'Seminar Hall',
          category: 'Technical',
          maxParticipants: 60, 
          registrationsCount: 45,
          createdBy: dummyCreatorId
        },
        { 
          title: 'CodeSprint 3.0', 
          description: 'A 24-hour campus hackathon to build SaaS platforms.',
          clubName: 'DJS CSI', 
          date: new Date('2026-08-27'), 
          time: '10:00 AM',
          venue: 'B-Block Lab',
          category: 'Technical',
          maxParticipants: 100, 
          registrationsCount: 83,
          createdBy: dummyCreatorId
        },
        { 
          title: 'Nritya - The Dance Fest', 
          description: 'Annual inter-department solo and group dance showcase.',
          clubName: 'DJS Synapse', 
          date: new Date('2026-08-30'), 
          time: '5:30 PM',
          venue: 'Auditorium',
          category: 'Cultural',
          maxParticipants: 200, 
          registrationsCount: 65,
          createdBy: dummyCreatorId
        },
        { 
          title: 'Career in Tech Talk', 
          description: 'Interaction session with top campus alumni working in tech.',
          clubName: 'DJS Unicode', 
          date: new Date('2026-09-02'), 
          time: '11:30 AM',
          venue: 'Seminar Hall',
          category: 'Seminar',
          maxParticipants: 80, 
          registrationsCount: 32,
          createdBy: dummyCreatorId
        },
      ]);
    }

    const registrationCount = await Registration.countDocuments();
    if (registrationCount === 0) {
      console.log('Seeding database with mock DJSphere registrations...');
      await Registration.insertMany([
        { studentName: 'Yagyata Karangutkar', studentEmail: 'yagyata@gmail.com', eventName: 'AI/ML Workshop', clubName: 'DJS CodeAI', registeredOn: new Date('2026-08-14') },
        { studentName: 'Riya Shah', studentEmail: 'riya@gmail.com', eventName: 'AI/ML Workshop', clubName: 'DJS CodeAI', registeredOn: new Date('2026-08-14') },
        { studentName: 'Ananya Mehta', studentEmail: 'ananya@gmail.com', eventName: 'CodeSprint 3.0', clubName: 'DJS CSI', registeredOn: new Date('2026-08-15') },
        { studentName: 'Karan Patel', studentEmail: 'karan@gmail.com', eventName: 'Nritya - The Dance Fest', clubName: 'DJS Synapse', registeredOn: new Date('2026-08-15') },
        { studentName: 'Tanmay Joshi', studentEmail: 'tanmay@gmail.com', eventName: 'Career in Tech Talk', clubName: 'DJS Unicode', registeredOn: new Date('2026-08-16') },
      ]);
      console.log('Mock database seeding completed successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
