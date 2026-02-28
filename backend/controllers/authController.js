import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js'; // Ensure the path includes .js

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add "export const" here
export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        avatar: picture,
        authMethod: 'google' 
      });
    }

    res.status(200).json({ 
      message: "Login successful", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error("Auth verification failed:", error);
    res.status(400).json({ message: "Invalid Google Token" });
  }
};