const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../dbmodels/User');
const Message = require('../dbmodels/Message');

router.get('/users', auth, async (req, res) => {
  const { q } = req.query;
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('-password')
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

// router.get("/messages/:id", auth, async (req, res) => {
//   const { q } = req.query;
//   const threadId = req.params.id;
//   try {
//     let thread = await Message.find({ _id: threadId }).all("messages");

//     if (!thread) {
//       return res.status(404).send("No messages found!");
//     }
//     res.json(...thread);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

router.post('/history', auth, async (req, res) => {
  const { from, to } = req.body;
  try {
    let thread = await Message.findOne({
      $or: [
        {
          $and: [{ from: { $eq: from } }, { to: { $eq: to } }],
        },
        {
          $and: [{ from: { $eq: to } }, { to: { $eq: from } }],
        },
      ],
    });
    if (!thread) {
      return res.status(404).send('No messages found! Start chating!');
    }
    res.json(thread);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
