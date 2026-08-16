// @desc    Get landing page statistics
// @route   GET /api/home
// @access  Public
export const getHomeStats = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        clubsCount: 25,
        eventsCount: 40,
        studentsCount: 1200
      }
    });
  } catch (error) {
    next(error);
  }
};
