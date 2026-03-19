
const mongoose = require('mongoose');
const User = require('../../app/modules/users/user.model');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/create-user.js <email> <password>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.DB_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.error(`User with email ${email} already exists.`);
    process.exit(1);
  }

  const user = new User();
  user.email = email;
  user.password = user.generateHash(password);

  await user.save();
  console.log('User created:', { id: user._id.toString(), email: user.email });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
