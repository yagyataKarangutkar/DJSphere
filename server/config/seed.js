import mongoose from 'mongoose';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

export const seedDatabase = async () => {
  try {
    const clubCount = await Club.countDocuments();
    const firstClub = await Club.findOne();
    const needsExpandedSeed = firstClub && !firstClub.logo;
    if (clubCount === 0 || needsExpandedSeed || clubCount < 14) {
      console.log('Seeding/Re-seeding database with mock DJSphere clubs...');
      await Club.deleteMany({});
      await Club.insertMany([
        {
          name: 'DJS CodeAI',
          type: 'Student Chapters',
          members: 150,
          logo: '/src/assets/CodeAi.png',
          tag: 'Coding Club',
          subtitle: 'Build. Innovate. Create.',
          description: 'CodeAI is a community of passionate coders and problem solvers who love building innovative solutions and exploring new technologies.',
          established: 2022,
          openTo: 'All Students',
          aboutText: 'We organize coding sessions, workshops, hackathons, and tech talks to help students learn, build, and grow together. Our focus ranges from web development to data science, artificial intelligence, and open-source contributions. Join us to start your coding journey and build real-world applications.',
          whatWeDo: 'CodeAI hosts regular weekly coding meetups, peer-led programming mentorship tracks, annual developer fests, and competitive programming contests.',
          socialLinks: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            facebook: 'https://facebook.com'
          }
        },
        {
          name: 'DJS CSI',
          type: 'Student Chapters',
          members: 120,
          logo: '/src/assets/CISI.png',
          tag: 'Student Chapters',
          subtitle: 'Computer Society of India',
          description: 'CSI student chapter promotes IT education, technical seminars, and programming competitions.',
          established: 2015,
          openTo: 'All Students',
          aboutText: 'The Computer Society of India student chapter at DJSCE is a hub for IT enthusiasts. We focus on bridging the gap between academia and industry requirements through quality events.',
          whatWeDo: 'We conduct annual coding competitions, networking bootcamps, resume review workshops, and industry expert guest lectures.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS IEEE',
          type: 'Student Chapters',
          members: 140,
          logo: '/src/assets/IEEE.png',
          tag: 'Student Chapters',
          subtitle: 'Institute of Electrical and Electronics Engineers',
          description: 'IEEE student chapter hosts hackathons, technical workshops, and promotes research in engineering fields.',
          established: 2012,
          openTo: 'All Students',
          aboutText: 'Our IEEE student branch fosters technical innovation and excellence for the benefit of humanity. We encourage students to collaborate on research papers and engineering projects.',
          whatWeDo: 'We organize national-level project contests, seminars on emerging technologies, and coding challenges.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS ACM SIGAI',
          type: 'Student Chapters',
          members: 95,
          logo: '/src/assets/robotics.jpg',
          tag: 'Student Chapters',
          subtitle: 'Special Interest Group on Artificial Intelligence',
          description: 'Focused on artificial intelligence, machine learning research, and state-of-the-art tech talks.',
          established: 2021,
          openTo: 'All Students',
          aboutText: 'ACM SIGAI provides a platform to study intelligence in all its forms. We guide students in training machine learning models, neural networks, and exploring data science tools.',
          whatWeDo: 'We organize ML bootcamps, kaggle competition prep tracks, and workshops on deep learning frameworks.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS SAE',
          type: 'Student Chapters',
          members: 110,
          logo: '/src/assets/SAE.png',
          tag: 'Student Chapters',
          subtitle: 'Society of Automotive Engineers',
          description: 'SAE designs, builds, and races formula race cars and all-terrain vehicles across national events.',
          established: 2014,
          openTo: 'Mechanical & Production',
          aboutText: 'SAE India student chapter allows students to gain hands-on experience in vehicle dynamics, automotive fabrication, design, and manufacturing.',
          whatWeDo: 'We build formula cars, conduct workshops on CAD modeling and engine tuning, and participate in national vehicle design contests.',
          socialLinks: { linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS RAS',
          type: 'Student Chapters',
          members: 130,
          logo: '/src/assets/RAS.png',
          tag: 'Student Chapters',
          subtitle: 'Robotics & Automation Society',
          description: 'RAS focuses on hands-on microcontroller design, sensory integration, and autonomous mobile robotics.',
          established: 2018,
          openTo: 'All Students',
          aboutText: 'The Robotics & Automation Society supports hands-on learning in electronics, firmware, and mechanical automation. We help students turn static parts into smart mobile robots.',
          whatWeDo: 'We run micro-controller training workshops, sensory design bootcamps, and robotics design challenges.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS ISME',
          type: 'Student Chapters',
          members: 85,
          logo: '/src/assets/SME.png',
          tag: 'Student Chapters',
          subtitle: 'Indian Society of Manufacturing Engineers',
          description: 'ISME hosts seminars, industrial visits, and project showcases in mechanical design and manufacturing.',
          established: 2017,
          openTo: 'Mechanical/Production/EXTC',
          aboutText: 'ISME promotes mechanical manufacturing practices, 3D printing design parameters, and CNC workshop operations to give practical knowledge.',
          whatWeDo: 'We arrange CNC training programs, 3D printing workshops, and tours to auto manufacturing facilities.',
          socialLinks: { linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Literature',
          type: 'Student Chapters',
          members: 60,
          logo: '/src/assets/nritya.jpg',
          tag: 'Cultural/Creative',
          subtitle: 'Literature & Debating Society',
          description: 'A vibrant community for writers, public speakers, and literature enthusiasts to express ideas.',
          established: 2019,
          openTo: 'All Students',
          aboutText: 'DJS Literature is the home of poets, writers, and debaters. We encourage creative writing and constructive debates on social and technical topics.',
          whatWeDo: 'We host debate championships, creative writing circles, poetry slams, and book discussion meets.',
          socialLinks: { linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Kronos',
          type: 'Teams',
          members: 45,
          logo: '/src/assets/career_talk.jpg',
          tag: 'Aero-Designing',
          subtitle: 'Official Aero-designing Team',
          description: 'DJS Kronos designs and manufactures heavy-lift RC aircraft to participate in global SAE Aero Design challenges.',
          established: 2016,
          openTo: 'All Students',
          aboutText: 'Kronos is the official aero-design team of DJSCE. We design, simulate, build, and test remote-controlled aircraft from scratch.',
          whatWeDo: 'We conduct workshops on aerodynamics, structural design, propulsion systems, and drone fabrication.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Racing',
          type: 'Teams',
          members: 50,
          logo: '/src/assets/codesprint.jpg',
          tag: 'Automotive Racing',
          subtitle: 'Official Formula Student Team',
          description: 'Forming the pinnacle of motorsports engineering at DJSCE by building formula racing cars annually.',
          established: 2011,
          openTo: 'Mechanical, EXTC, Comp',
          aboutText: 'DJS Racing builds electric and combustion formula cars to compete in Formula Bharat and global FS competitions.',
          whatWeDo: 'We carry out chassis simulation, suspension testing, telemetry setups, and engine performance tuning.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Skylark',
          type: 'Teams',
          members: 40,
          logo: '/src/assets/ai_workshop.jpg',
          tag: 'UAV/Drones',
          subtitle: 'Autonomous UAV Design Team',
          description: 'Specializes in design and fabrication of state-of-the-art quadcopters and multi-rotor drones.',
          established: 2015,
          openTo: 'All Students',
          aboutText: 'DJS Skylark creates autonomous quadcopters and drones for surveillance, crop monitoring, and search & rescue exercises.',
          whatWeDo: 'We build autonomous autopilots, perform structural fluid testing, and run drone flight training sessions.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Robocon',
          type: 'Teams',
          members: 35,
          logo: '/src/assets/robotics.jpg',
          tag: 'Competitive Robotics',
          subtitle: 'Official ABU Robocon Team',
          description: 'Builds high-precision autonomous and manual robots to compete in the national ABU Robocon challenges.',
          established: 2010,
          openTo: 'All Students',
          aboutText: 'We build complex autonomous machines capable of coordination, throwing objects, and obstacle navigation.',
          whatWeDo: 'We construct precision robotics systems, write robot trajectory software, and program sensors.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Astra',
          type: 'Teams',
          members: 30,
          logo: '/src/assets/career_talk.jpg',
          tag: 'Space Robotics',
          subtitle: 'Official Martian Rover Team',
          description: 'Designs and builds advanced Martian rovers to compete in international space rover challenges.',
          established: 2019,
          openTo: 'All Students',
          aboutText: 'Astra builds space-grade rover systems complete with robotic arms, scientific sensor cells, and autonomous navigation.',
          whatWeDo: 'We design mechanical linkages, integrate spectrometer scientific tests, and code obstacle avoidance.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        },
        {
          name: 'DJS Phoenix',
          type: 'Teams',
          members: 25,
          logo: '/src/assets/codesprint.jpg',
          tag: 'Underwater Robotics',
          subtitle: 'Underwater Robotics Team',
          description: 'Builds Autonomous Underwater Vehicles (AUVs) and ROVs for deep-sea navigation and manipulation challenges.',
          established: 2020,
          openTo: 'All Students',
          aboutText: 'Phoenix builds underwater autonomous vehicles fitted with custom thrusters, cameras, and depth sensors for navigation.',
          whatWeDo: 'We carry out waterproof pressure testing, autonomous hull balance, and sub-aquatic path planning.',
          socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        }
      ]);
    }

    const eventCount = await Event.countDocuments();
    if (eventCount < 5) {
      console.log('Seeding/Re-seeding database with mock DJSphere events...');
      await Event.deleteMany({});
      const dummyCreatorId = new mongoose.Types.ObjectId('65d21a221f1d1d8c1c000000');
      await Event.insertMany([
        { 
          title: 'AI/ML Workshop', 
          description: 'Hands-on workshop to explore the world of Artificial Intelligence and Machine Learning. Learn neural networks, model training, and Python libraries.',
          clubName: 'DJS CodeAI', 
          date: new Date('2026-08-24'), 
          time: '4:00 PM - 7:00 PM',
          venue: 'DJSCE, Seminar Hall',
          category: 'Workshop',
          maxParticipants: 60, 
          registrationsCount: 45,
          createdBy: dummyCreatorId
        },
        { 
          title: 'CodeSprint 3.0', 
          description: 'A 24-hour campus hackathon to build premium SaaS platforms. Collaborate, design, and code with fellow students.',
          clubName: 'DJS CSI', 
          date: new Date('2026-08-27'), 
          time: '10:00 AM - 10:00 AM (Next Day)',
          venue: 'DJSCE, Lab 101',
          category: 'Competition',
          maxParticipants: 100, 
          registrationsCount: 83,
          createdBy: dummyCreatorId
        },
        { 
          title: 'Nritya - The Dance Fest', 
          description: 'Annual inter-department solo and group dance showcase. Where rhythm meets grace on the big stage.',
          clubName: 'DJS Synapse', 
          date: new Date('2026-08-30'), 
          time: '5:30 PM - 8:30 PM',
          venue: 'DJSCE, Auditorium',
          category: 'Cultural',
          maxParticipants: 200, 
          registrationsCount: 65,
          createdBy: dummyCreatorId
        },
        { 
          title: 'Career in Tech Talk', 
          description: 'Interaction session with top campus alumni working in tech giants. Get insights on roadmap planning and interviewing.',
          clubName: 'DJS Unicode', 
          date: new Date('2026-09-02'), 
          time: '11:30 AM - 1:30 PM',
          venue: 'DJSCE, Room 304',
          category: 'Talk',
          maxParticipants: 80, 
          registrationsCount: 32,
          createdBy: dummyCreatorId
        },
        { 
          title: 'Robotics Workshop', 
          description: 'An intensive hands-on session on microcontroller circuits, sensor interfaces, and robotic assembly.',
          clubName: 'DJS ACM SIGCHI', 
          date: new Date('2026-09-05'), 
          time: '2:00 PM - 5:00 PM',
          venue: 'DJSCE, Robotics Lab',
          category: 'Other',
          maxParticipants: 50, 
          registrationsCount: 12,
          createdBy: dummyCreatorId
        },
      ]);
    }

    const registrationCount = await Registration.countDocuments();
    const firstReg = await Registration.findOne();
    const needsRevertSeed = firstReg && (firstReg.branch || firstReg.rollNumber);
    if (registrationCount === 0 || needsRevertSeed) {
      console.log('Seeding/Re-seeding database with mock DJSphere registrations...');
      await Registration.deleteMany({});
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
