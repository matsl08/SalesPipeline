// routes/reports.js
router.post('/generate', auth, async (req, res) => {
    try {
      const { type, filters } = req.body;
      
      let reportData;
      
      switch (type) {
        case 'status':
          reportData = await generateStatusReport(filters);
          break;
        case 'conversion':
          reportData = await generateConversionReport(filters);
          break;
        case 'value':
          reportData = await generateValueReport(filters);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      const report = new Report({
        type,
        filters,
        data: reportData,
        generatedBy: req.user.id
      });
      
      await report.save();
      res.status(201).json(report);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  async function generateStatusReport(filters) {
    const match = buildMatchQuery(filters);
    
    return Lead.aggregate([
      { $match: match },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' }
      }},
      { $project: {
        status: '$_id',
        count: 1,
        totalValue: 1,
        percentage: {
          $multiply: [
            { $divide: ['$count', { $count: {} }] },
            100
          ]
        },
        _id: 0
      }}
    ]);
  }