const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author_name: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["announcement", "lost_found", "event"],
      required: true,
    },
    author_name: { type: String, default: "Anonymous" },
    status: { type: String, default: null },
    event_date: { type: Date, default: null },
    image_url: { type: String, default: null },
    comments: { type: [commentSchema], default: [] },
    vote_count: { type: Number, default: 0 },
    voted_by: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Post", postSchema);
