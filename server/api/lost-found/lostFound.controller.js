const Post = require("../../models/Post");

const getAll = async (req, res) => {
  try {
    const results = await Post.find({ category: "lost_found" }).sort({ created_at: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, category: "lost_found" });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  const { title, description, author_name, status, image_url } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: "Title and description are required" });
  const itemStatus = ["lost", "found", "claimed"].includes(status) ? status : "lost";
  try {
    const post = await Post.create({
      title,
      description,
      category: "lost_found",
      author_name: author_name || "Anonymous",
      status: itemStatus,
      image_url: image_url || null,
    });
    res.status(201).json({ id: post._id, message: "Lost & Found post created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  const { title, description, author_name, status } = req.body;
  const itemStatus = ["lost", "found", "claimed"].includes(status) ? status : "lost";
  try {
    const result = await Post.findOneAndUpdate(
      { _id: req.params.id, category: "lost_found" },
      { title, description, author_name: author_name || "Anonymous", status: itemStatus },
      { new: true }
    );
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Lost & Found post updated" });
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await Post.findOneAndDelete({ _id: req.params.id, category: "lost_found" });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Lost & Found post deleted" });
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
      { _id: req.params.id, category: "lost_found" },
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
      { _id: req.params.id, category: "lost_found" },
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

module.exports = { getAll, getById, create, update, remove, addComment, deleteComment };
