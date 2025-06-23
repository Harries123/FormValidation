import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  gender: String,
  dob: String, // or Date if preferred
  address: String,
  pincode: String,
  govtIdType: String,
  govtIdNumber: String,
  gstNo: String,
  password: {
    type: String,
    required: true,
  },
  idProof: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Form', FormSchema);
