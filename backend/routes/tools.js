const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');

// Get all tools
router.get('/', async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tools by category
router.get('/category/:category', async (req, res) => {
  try {
    const tools = await Tool.find({ category: req.params.category });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories with their tools
router.get('/categories', async (req, res) => {
  try {
    const categories = await Tool.aggregate([
      {
        $group: {
          _id: '$category',
          categoryLabel: { $first: '$categoryLabel' },
          categoryColor: { $first: '$categoryColor' },
          categoryIcon: { $first: '$categoryIcon' },
          categoryDesc: { $first: '$categoryDesc' },
          tools: {
            $push: {
              _id: '$_id',
              name: '$name',
              desc: '$desc',
              url: '$url',
              free: '$free',
              platform: '$platform',
              level: '$level',
              commonCommands: '$commonCommands',
              automationScripts: '$automationScripts'
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single tool
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tool
router.post('/', async (req, res) => {
  try {
    const tool = new Tool(req.body);
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update tool
router.put('/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete tool
router.delete('/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;