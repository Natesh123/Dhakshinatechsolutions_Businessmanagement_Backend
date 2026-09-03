const { connectDB, sequelize } = require('./dist/config/database');
const { User } = require('./dist/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function run() {
  await connectDB();
  try {
    const user = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!user) {
      console.log('User not found');
      return;
    }
    const isMatch = await bcrypt.compare('password123', user.passwordHash);
    console.log('isMatch:', isMatch);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log('Token created successfully');
  } catch (err) {
    console.error('Error details:', err);
  } finally {
    await sequelize.close();
  }
}
run();
