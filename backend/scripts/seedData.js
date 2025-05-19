import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import connectDatabase from '../db/db.js';

dotenv.config();

// Sample lead data
const leadData = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    company: 'ABC Corp',
    value: 25000,
    source: 'Website',
    status: 'cold',
    category: 'prospect',
    notes: 'Initial contact made via website form'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '555-234-5678',
    company: 'XYZ Inc',
    value: 50000,
    source: 'Referral',
    status: 'warm',
    category: 'prospect',
    notes: 'Referred by existing client'
  },
  {
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '555-345-6789',
    company: 'Tech Solutions',
    value: 75000,
    source: 'LinkedIn',
    status: 'hot',
    category: 'prospect',
    notes: 'Very interested in our enterprise solution'
  },
  {
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '555-456-7890',
    company: 'Global Services',
    value: 100000,
    source: 'Conference',
    status: 'cooked',
    category: 'client',
    notes: 'Contract signed, implementation in progress'
  },
  {
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '555-567-8901',
    company: 'Innovative Systems',
    value: 35000,
    source: 'Cold Call',
    status: 'cold',
    category: 'prospect',
    notes: 'Initial call made, follow-up scheduled'
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    phone: '555-678-9012',
    company: 'Creative Solutions',
    value: 60000,
    source: 'Email Campaign',
    status: 'warm',
    category: 'prospect',
    notes: 'Responded to email campaign, demo scheduled'
  },
  {
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    phone: '555-789-0123',
    company: 'Data Systems',
    value: 85000,
    source: 'Partner Referral',
    status: 'hot',
    category: 'prospect',
    notes: 'Proposal submitted, awaiting decision'
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    phone: '555-890-1234',
    company: 'Enterprise Corp',
    value: 120000,
    source: 'Website',
    status: 'cooked',
    category: 'client',
    notes: 'Deal closed, implementation complete'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDatabase();
    
    // Clear existing data
    await Lead.deleteMany({});
    console.log('Existing leads deleted');
    
    // Insert new data
    const leads = await Lead.insertMany(leadData);
    console.log(`${leads.length} leads inserted successfully`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
