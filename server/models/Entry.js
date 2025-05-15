import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please provide a valid Gmail address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  hobbies: {
    type: [String],
    required: [true, 'At least one hobby is required'],
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: 'Please add at least one hobby'
    }
  },
  place: {
    type: String,
    required: [true, 'Place is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be either Male, Female, or Other'
    }
  }
}, {
  timestamps: true
});

// Create indexes for filtering and sorting
EntrySchema.index({ name: 1 });
EntrySchema.index({ email: 1 });
EntrySchema.index({ phone: 1 });
EntrySchema.index({ place: 1 });
EntrySchema.index({ gender: 1 });

const Entry = mongoose.model('Entry', EntrySchema);

export default Entry;