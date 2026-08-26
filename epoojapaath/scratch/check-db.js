const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://pritamcodeservir_db_user:UeBGUF1hOzBJSlam@plantseelingproject.cgru8ib.mongodb.net/epoojapaath';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  const bookingsCount = await db.collection('bookings').countDocuments();
  console.log('Total Bookings:', bookingsCount);

  const bookings = await db.collection('bookings').find({}).limit(5).toArray();
  console.log('Sample Bookings:', JSON.stringify(bookings, null, 2));

  await mongoose.disconnect();
}

check().catch(console.error);
