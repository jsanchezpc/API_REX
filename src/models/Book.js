const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"],
    },
    title: {
        type: String,
        unique: true,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    chapters: [{
        title: {
            type: String,
            required: [true, "Chapter title is required"],
            trim: true,
        },
        pages: [{
            pageNumber: {
                type: Number,
                required: [true, "Page number is required"],
                min: [1, "Page number must be at least 1"],
            },
            content: {
                type: String,
                required: [true, "Content is required"],
            },
        }],
    }],
    characters: {
        type: [{
            name: String,
            description: String,
        }],
        default: [],
    },
    collaborators: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    mcp: {
        system: {
            name: { type: String, default: "Grex" },
            version: { type: String, default: "0.1.0" },
            mode: { type: String, default: "creative-writing" }
        },
        user: {
            id: { type: String },
            name: { type: String },
            preferences: {
                language: { type: String, default: "es" },
                writingStyle: { type: String },
                preferredGenres: [{ type: String }]
            }
        },
        context: {
            currentChapter: { type: Number, default: 1 },
            cursorPosition: { type: Schema.Types.Mixed },
            recentText: { type: String }
        }
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("Book", bookSchema);
