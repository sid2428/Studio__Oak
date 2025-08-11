import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, default: 'Pending' }, // e.g., Pending, In Progress, Resolved
}, { timestamps: true });

const SupportRequest = mongoose.models.supportRequest || mongoose.model('supportRequest', supportRequestSchema);

export default SupportRequest;
