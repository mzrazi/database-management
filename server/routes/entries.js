import express from 'express';
import Entry from '../models/Entry.js';

const router = express.Router();

// Get all entries with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortField = 'name', 
      sortOrder = 'asc',
      name,
      email,
      phone,
      place,
      gender,
      hobbies
    } = req.query;

    // Create filter object
    const filter = {};
    
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (phone) filter.phone = { $regex: phone, $options: 'i' };
    if (place) filter.place = { $regex: place, $options: 'i' };
    if (gender) filter.gender = gender;
    
    // Handle hobbies array filter
    if (hobbies) {
      const hobbiesArray = Array.isArray(hobbies) 
        ? hobbies 
        : typeof hobbies === 'string' 
          ? JSON.parse(hobbies) 
          : [];
      
      if (hobbiesArray.length > 0) {
        filter.hobbies = { $in: hobbiesArray };
      }
    }

    // Count total documents with applied filters
    const total = await Entry.countDocuments(filter);

    // Build sort object
    const sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Fetch paginated data
    const entries = await Entry.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: entries
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new entry
router.post('/', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update an entry by ID
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error updating entry:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;