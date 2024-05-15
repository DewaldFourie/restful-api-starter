import mongoose from "mongoose";

// New DB Schema for creating a new message (NB: see how a message gets associated with a user as well)
const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

