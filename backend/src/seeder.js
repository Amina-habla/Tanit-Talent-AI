const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data (jobs and custom seeded users)
    await Job.deleteMany({});
    await User.deleteMany({ email: { $in: ['recruiter@tanit.com', 'candidate@tanit.com'] } });

    // Create Recruiter
    const recruiter = await User.create({
      name: 'Tanit Recruiter',
      email: 'recruiter@tanit.com',
      role: 'RECRUITER',
      password: 'password123'
    });
    console.log('Recruiter seeded:', recruiter.email);

    // Create Candidate
    const candidate = await User.create({
      name: 'John Doe',
      email: 'candidate@tanit.com',
      role: 'CANDIDATE',
      password: 'password123'
    });
    console.log('Candidate seeded:', candidate.email);

    // Create Jobs
    const jobs = [
      {
        title: 'Full Stack JavaScript Developer',
        description: 'We are looking for a skilled JavaScript Developer with experience in React, Node.js, and MongoDB.',
        company: 'Tanit Tech',
        location: 'Tunis, Tunisia',
        salary: '1500 - 2500 TND',
        type: 'Full-time',
        recruiter: recruiter._id
      },
      {
        title: 'Python AI & NLP Engineer',
        description: 'Join our team to build state-of-the-art NLP features and recommendation systems using Flask and Scikit-learn.',
        company: 'AI Solutions',
        location: 'Remote',
        salary: '2000 - 3500 TND',
        type: 'Full-time',
        recruiter: recruiter._id
      },
      {
        title: 'Frontend React UI Developer',
        description: 'Create premium interfaces with Framer Motion, Tailwind CSS, and glassmorphism design styles.',
        company: 'Creative Studio',
        location: 'Ariana, Tunisia',
        salary: '1200 - 2000 TND',
        type: 'Contract',
        recruiter: recruiter._id
      },
      {
        title: 'DevOps & Cloud Engineer',
        description: 'Manage Docker environments, AWS architectures, and CI/CD automated deployment pipelines.',
        company: 'Cloud Corp',
        location: 'Sousse, Tunisia',
        salary: '2500 - 4000 TND',
        type: 'Full-time',
        recruiter: recruiter._id
      }
    ];

    await Job.create(jobs);
    console.log('Jobs successfully seeded!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
