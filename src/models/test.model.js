import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    challenge: {
        type: Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    description: {
        type: String,
    },
    request: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Test = mongoose.model('Test', testSchema, 'tests');