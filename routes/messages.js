const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Message = require("../dbmodels/Message");

router.post(
  "/",
  auth,
  [check("text", "Text message is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { from, to, text } = req.body;
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
        thread = new Message({
          from,
          to,
          messages: [
            {
              sender: from,
              text,
            },
          ],
        });
      } else {
        thread.messages = [...thread.messages, { sender: from, text }];
      }
      await thread.save();
      res.json(thread);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post("/history", auth, async (req, res) => {
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
      return res.status(404).send("No messages found! Start chating!");
    }
    res.json(thread);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
