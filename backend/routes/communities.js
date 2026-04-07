import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Get community data (Reddit and Discord)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      res.json(data[0]);
    } else {
      // Return default community data structure
      res.json({
        reddits: [
          { name: "r/ReverseEngineering", url: "https://reddit.com/r/ReverseEngineering", desc: "High quality posts on binary RE, tools, and research papers. Low noise.", tag: "RE", members: "~70k" },
          { name: "r/Malware", url: "https://reddit.com/r/Malware", desc: "Malware identification, reports, sandbox results, and IOC sharing.", tag: "Malware", members: "~60k" },
          { name: "r/blueteamsec", url: "https://reddit.com/r/blueteamsec", desc: "Technical detection engineering. High-quality curated links.", tag: "Detection", members: "~95k" },
          { name: "r/netsec", url: "https://reddit.com/r/netsec", desc: "Curated security research. Strict quality bar. No beginner questions.", tag: "Research", members: "~440k" },
          { name: "r/MalwareResearch", url: "https://reddit.com/r/MalwareResearch", desc: "Community specifically for malware researchers and analysts.", tag: "RE", members: "~15k" },
          { name: "r/threatintel", url: "https://reddit.com/r/threatintel", desc: "IOC sharing, strategic threat analysis, and intel community discussion.", tag: "Intel", members: "~30k" },
        ],
        discords: [
          { name: "Malware Analysis & Reverse Engineering", desc: "OALabs community. Active channels for RE help, tool discussion, and sample sharing. Best beginner-friendly RE Discord.", url: "https://discord.gg/oalabs", tag: "RE" },
          { name: "The DFIR Report Community", desc: "DFIR practitioners sharing detection notes, playbooks, and incident response experience.", url: "https://discord.gg/dfirreport", tag: "DFIR" },
          { name: "Hack The Box", desc: "Active community around RE challenges, binary exploitation, and CTF coordination.", url: "https://discord.gg/hackthebox", tag: "CTF" },
          { name: "pwn.college Discord", desc: "Community for the pwn.college learning platform. Ask questions, get mentorship on RE labs.", url: "https://pwn.college/discord", tag: "Learning" },
          { name: "OpenSecurityTraining2", desc: "Community for OST2 courses. Get help on kernel internals, RE, and x86 assembly courses.", url: "https://discord.gg/ost2", tag: "RE" },
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update community data
router.put('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Update existing record
      const { data: updatedData, error: updateError } = await supabase
        .from('communities')
        .update(req.body)
        .eq('id', data[0].id)
        .select();
      
      if (updateError) throw updateError;
      res.json(updatedData?.[0]);
    } else {
      // Insert new record
      const { data: insertedData, error: insertError } = await supabase
        .from('communities')
        .insert([req.body])
        .select();
      
      if (insertError) throw insertError;
      res.json(insertedData?.[0]);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
