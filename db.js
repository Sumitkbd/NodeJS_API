const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/simple-mean-db', {
      //  useNewUrlParser: true,
      //  useUnifiedTopology: true,
      //  useFindAndModify: false,
      //  useCreateIndex: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
module.exports = connectDB;
