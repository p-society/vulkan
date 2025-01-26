import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
})

const Test = mongoose.model('Challenge', challengeSchema, 'challenges');