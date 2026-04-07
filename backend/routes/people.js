import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Get all people
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single person
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new person
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.status(201).json(data?.[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update person
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete person
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('people')
      .delete()
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
