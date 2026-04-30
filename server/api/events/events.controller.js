const Post = require("../../models/Post");

const getAll = async (req, res) => {
  try {
    const results = await Post.find({ category: "event" }).sort({ event_date: 1, created_at: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, category: "event" });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  const { title, description, author_name, event_date, image_url } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: "Title and description are required" });
  try {
    const post = await Post.create({
      title,
      description,
      category: "event",
      author_name: author_name || "Anonymous",
      event_date: event_date || null,
      image_url: image_url || null,
    });
    res.status(201).json({ id: post._id, message: "Event created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const { title, description, author_name, event_date } = req.body;
  try {
    const result = await Post.findOneAndUpdate(
      { _id: req.params.id, category: "event" },
      { title, description, author_name: author_name || "Anonymous", event_date: event_date || null },
      { new: true }
    );
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Event updated" });
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await Post.findOneAndDelete({ _id: req.params.id, category: "event" });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
  const { text, author_name } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text is required" });
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, category: "event" },
      { $push: { comments: { author_name: author_name || "Anonymous", text } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Not found" });
    const comment = post.comments[post.comments.length - 1];
    res.status(201).json(comment);
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, category: "event" },
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const vote = async (req, res) => {
  const userId = String(req.user.id);
  try {
    const post = await Post.findOne({ _id: req.params.id, category: "event" });
    if (!post) return res.status(404).json({ error: "Not found" });
    const alreadyVoted = post.voted_by.includes(userId);
    if (alreadyVoted) {
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { voted_by: userId },
        $inc: { vote_count: -1 },
      });
      return res.json({ voted: false, vote_count: post.vote_count - 1 });
    } else {
      await Post.findByIdAndUpdate(req.params.id, {
        $addToSet: { voted_by: userId },
        $inc: { vote_count: 1 },
      });
      return res.json({ voted: true, vote_count: post.vote_count + 1 });
    }
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove, addComment, deleteComment, vote };
