const EnergyReading = require('../models/EnergyReading');

// @route   GET /api/energy/readings
// @access  Private (all roles)
// @query   startDate, endDate, region, meterType, page, limit
const getReadings = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      region,
      meterType,
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    if (region && region !== 'All') filter.region = region;
    if (meterType && meterType !== 'All') filter.meterType = meterType;

    const skip = (Number(page) - 1) * Number(limit);
    const [readings, total] = await Promise.all([
      EnergyReading.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      EnergyReading.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/energy/summary
// @access  Private (all roles)
const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, region } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    if (region && region !== 'All') matchStage.region = region;

    const summary = await EnergyReading.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalConsumption: { $sum: '$consumption' },
          totalCost: { $sum: '$cost' },
          totalCarbon: { $sum: '$carbonEmission' },
          avgPeakDemand: { $avg: '$peakDemand' },
          readingCount: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, data: summary[0] || {} });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/energy/trend
// @access  Private (all roles)
// Returns daily aggregated consumption for the chart
const getTrend = async (req, res, next) => {
  try {
    const { startDate, endDate, region, meterType } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    if (region && region !== 'All') matchStage.region = region;
    if (meterType && meterType !== 'All') matchStage.meterType = meterType;

    const trend = await EnergyReading.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          consumption: { $sum: '$consumption' },
          cost: { $sum: '$cost' },
          carbonEmission: { $sum: '$carbonEmission' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day',
                },
              },
            },
          },
          consumption: { $round: ['$consumption', 2] },
          cost: { $round: ['$cost', 2] },
          carbonEmission: { $round: ['$carbonEmission', 2] },
        },
      },
    ]);

    res.json({ success: true, data: trend });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/energy/by-region
// @access  Private (Analyst, Admin)
const getByRegion = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const data = await EnergyReading.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$region',
          totalConsumption: { $sum: '$consumption' },
          totalCost: { $sum: '$cost' },
        },
      },
      { $project: { region: '$_id', totalConsumption: 1, totalCost: 1, _id: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReadings, getSummary, getTrend, getByRegion };
