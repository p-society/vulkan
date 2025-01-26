import mongoose from "mongoose";
import { SubmissionStatus } from "../constants/submission-status";

const submissionSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    challenge: {
        type: Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(SubmissionStatus),
        default: SubmissionStatus.PENDING
    }
}, {
    timestamps: true
})

const Test = mongoose.model('Submission', testSchema, 'submissions');