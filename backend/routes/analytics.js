
router.post('/', auth, async (req, res) => {
    try {
      const interaction = new Interaction({
        ...req.body,
        createdBy: req.user.id
      });
      
      const savedInteraction = await interaction.save();
      
      // Add to lead's interaction history
      await Lead.findByIdAndUpdate(req.body.lead, {
        $push: { interactions: savedInteraction._id },
        lastContact: Date.now()
      });
      
      res.status(201).json(savedInteraction);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });