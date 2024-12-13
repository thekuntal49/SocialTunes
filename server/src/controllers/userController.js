let activeUsers = [];

export const getActiveUsers = (req, res) => {
  res.status(200).json(activeUsers);
};
