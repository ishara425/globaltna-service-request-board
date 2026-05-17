const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');

// ─── GET /api/jobs ───────────────────────────────────────────
// Get all jobs. Supports ?category=Plumbing and ?status=Open
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── GET /api/jobs/:id ───────────────────────────────────────
// Get a single job by its ID
router.get('/:id', async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── POST /api/jobs ──────────────────────────────────────────
// Create a new job
router.post('/', async (req, res) => {
  try {
    const job = new JobRequest(req.body);
    const savedJob = await job.save();
    res.status(201).json(savedJob);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── PATCH /api/jobs/:id ─────────────────────────────────────
// Update only the status of a job
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['Open', 'In Progress', 'Closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }   // returns the updated job, not the old one
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─── DELETE /api/jobs/:id ────────────────────────────────────
// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;