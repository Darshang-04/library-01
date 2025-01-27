const BorrowedBook = require("../../db/schema/borrowedbooks");

exports.tommorowdue = async (req, res) => {
  try {
    // Define the current time and calculate the time 10 minutes ago
    const now = new Date();
    const tenMinutesAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Query for books due between 10 minutes ago and now
    const dueBooks = await BorrowedBook.find({
      dueDate: { $gte: now, $lte: tenMinutesAhead },
    })
      .populate("book", "title author") // Populate book details: 'name' and 'author' fields
      .populate("user", "firstName lastName email"); // Populate user details: 'name', 'email', and 'contactNumber'

    // Send a successful response with the retrieved data
    res.status(200).json({
      success: true,
      dueBooks,
    });
  } catch (error) {
    console.error("Error fetching books due within 10 minutes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching books due soon." });
  }
};

exports.todaydue = async (req, res) => {
  try {
    // Define the current time and calculate the time 10 minutes ago
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0); // Set to midnight
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Query for books due between 10 minutes ago and now
    const todayDue = await BorrowedBook.find({
      dueDate: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("book", "title author") // Populate book details: 'name' and 'author' fields
      .populate("user", "firstName lastName email"); // Populate user details: 'name', 'email', and 'contactNumber'

    // Send a successful response with the retrieved data
    res.status(200).json({
      success: true,
      todayDue,
    });
  } catch (error) {
    console.error("Error fetching books due within 10 minutes:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching books due soon." });
  }
};
