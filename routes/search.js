const express = require("express");
const router = express.Router();

const User = require("../dbmodels/User");

router.get("/users", async (req, res) => {
  const { q } = req.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .sort({ _id: -1 })
      .exec();

    //@ get count of documents have been found

    // const count = await User.countDocuments({
    //   $or: [
    //     { firstName: { $regex: q, $options: 'i' } },
    //     { lastName: { $regex: q, $options: 'i' } },
    //     { email: { $regex: q, $options: 'i' } },
    //   ],
    // });
    res.json([...users]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
