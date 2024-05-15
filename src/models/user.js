import mongoose from "mongoose";

// New DB Schema for a creating a new user
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true },
);

// Modal method to find a user by their username or email for future use
userSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
        username: login,
    });

    if (!user) {
        user = await this.findOne({
            email: login,
        });
    }

    return user;
};

// Extend the Schema with a hook to implement cascade deleting for all 
// messages associated with the user if a user is deleted.
userSchema.pre('remove', function(next) {
    this.modal('Message').deleteMany({ user: this._id }, next)
});

const User = mongoose.model('User', userSchema);

export default User;


