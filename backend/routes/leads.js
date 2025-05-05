
router.patch('/:id/categorize', auth, async (req, res) => {
    try {
      const { status, category } = req.body;
      const lead = await Lead.findById(req.params.id);
      
      if (!lead) return res.status(404).json({ message: 'Lead not found' });
      
      if (status) lead.status = status;
      if (category) lead.category = category;
      
      await lead.save();
      res.json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });