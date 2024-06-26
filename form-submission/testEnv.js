// testEnv.js
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined');
} else {
  console.log('MONGO_URI:', mongoUri);
}