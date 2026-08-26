const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://pritamcodeservir_db_user:UeBGUF1hOzBJSlam@plantseelingproject.cgru8ib.mongodb.net/epoojapaath';

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  const totalBookings = await db.collection('bookings').countDocuments();
  const paidBookings = await db.collection('bookings').countDocuments({ paymentStatus: 'paid' });

  const revAgg = await db.collection('bookings').aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).toArray();

  const totalRevenue = revAgg[0]?.total || 0;

  const recentBookings = await db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(10).toArray();

  console.log({
    totalBookings,
    paidBookings,
    totalRevenue,
    conversionRate: totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : "0.0",
    recentBookingsCount: recentBookings.length,
    sampleDevotee: recentBookings[0]?.devoteeName
  });

  await mongoose.disconnect();
}

test().catch(console.error);
