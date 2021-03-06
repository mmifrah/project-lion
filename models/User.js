const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    },
    name: String,
    knownLanguages: [String],
    learningLanguages: [String],
    location: {
      country: String,
      city: String
    },
    ownEvents: [Schema.Types.ObjectId],
    events: [Schema.Types.ObjectId],
    tandems: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        lastActivity: Date
      }
    ],
    picture: String,

    description: String,
    gender: {
      type: String,
      enum: ["Female", "Male"]
    },
    age: Number,
    blockedUsers: [Schema.Types.ObjectId]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
