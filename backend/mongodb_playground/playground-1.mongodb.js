/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/
use('salesPipeline');

// Aggregation to calculate Total Sales, Conversion Rate, and Active Leads
db.getCollection('leads').aggregate([
  {
    $facet: {
      // Total Sales: Sum of 'value' for leads with status 'Closed-Won'
      totalSales: [
        { $match: { status: 'Closed-Won' } },
        { $group: { _id: null, totalSales: { $sum: '$value' } } }
      ],
      // Conversion Rate: Percentage of 'Closed-Won' leads out of total leads
      conversionRate: [
        {
          $group: {
            _id: null,
            totalLeads: { $sum: 1 },
            closedWonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Closed-Won'] }, 1, 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            conversionRate: {
              $multiply: [{ $divide: ['$closedWonLeads', '$totalLeads'] }, 100]
            }
          }
        }
      ],
      // Active Leads: Count of leads with status 'Active'
      activeLeads: [
        { $match: { status: 'Active' } },
        { $count: 'activeLeads' }
      ]
    }
  },
  {
    $project: {
      totalSales: { $arrayElemAt: ['$totalSales.totalSales', 0] },
      conversionRate: { $arrayElemAt: ['$conversionRate.conversionRate', 0] },
      activeLeads: { $arrayElemAt: ['$activeLeads.activeLeads', 0] }
    }
  }
]);
