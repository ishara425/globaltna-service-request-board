const mongoose = require('mongoose');
require('dotenv').config();
const JobRequest = require('./models/JobRequest');

const sampleJobs = [
  {
    title: 'Kitchen Tap Leaking - Urgent',
    description: 'Need a plumber to fix a leaking kitchen tap. Water is dripping constantly and causing issues. Would like someone available this week.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah.m@email.com',
    status: 'Open',
  },
  {
    title: 'Bathroom Electrical Outlet Installation',
    description: 'Looking for a qualified electrician to install a new electrical outlet in the bathroom for a washing machine connection.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'James Robertson',
    contactEmail: 'james.r@email.com',
    status: 'In Progress',
  },
  {
    title: 'Living Room Painting',
    description: 'Need a professional painter to paint our living room. Room is approximately 4m x 5m. Looking for quality finish in neutral tones.',
    category: 'Painting',
    location: 'Glasgow',
    contactName: 'Emily Watson',
    contactEmail: 'emily.w@email.com',
    status: 'Open',
  },
  {
    title: 'Custom Kitchen Cabinets',
    description: 'Seeking an experienced joiner to build and install custom kitchen cabinets. Have detailed plans ready. Budget is flexible for quality work.',
    category: 'Joinery',
    location: 'Aberdeen',
    contactName: 'David Clark',
    contactEmail: 'david.c@email.com',
    status: 'Open',
  },
  {
    title: 'Outdoor Garden Lighting Installation',
    description: 'Want to install garden lighting around the patio and walkways. Need electrician experienced with outdoor weatherproof fixtures.',
    category: 'Electrical',
    location: 'Glasgow',
    contactName: 'Laura Thompson',
    contactEmail: 'laura.t@email.com',
    status: 'Closed',
  },
  {
    title: 'Bathroom Sink Replacement',
    description: 'Old bathroom sink needs replacing. Have already purchased the new sink, just need professional installation and pipe connections.',
    category: 'Plumbing',
    location: 'Edinburgh',
    contactName: 'Mark Henderson',
    contactEmail: 'mark.h@email.com',
    status: 'In Progress',
  },
  {
    title: 'Fence Repair After Storm',
    description: 'Storm damaged three fence panels in the back garden. Need a joiner to replace panels and reinforce the remaining structure.',
    category: 'Joinery',
    location: 'Dundee',
    contactName: 'Patricia Burns',
    contactEmail: 'patricia.b@email.com',
    status: 'Open',
  },
  {
    title: 'Bedroom Ceiling Repaint',
    description: 'Bedroom ceiling has water stain marks from a previous leak which has now been fixed. Need a painter to prep and repaint the ceiling.',
    category: 'Painting',
    location: 'Perth',
    contactName: 'Alan Scott',
    contactEmail: 'alan.s@email.com',
    status: 'Open',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Inserted ${sampleJobs.length} sample jobs`);

    mongoose.connection.close();
    console.log('✅ Done! Database seeded successfully.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();