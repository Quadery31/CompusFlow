import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  authMethod: { type: String, default: 'google' },
  createdAt: { type: Date, default: Date.now }
});

// THIS IS THE KEY FIX
const User = mongoose.model('User', userSchema);
export default User;