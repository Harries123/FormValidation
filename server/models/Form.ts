import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export default mongoose.model('Form', FormSchema);
