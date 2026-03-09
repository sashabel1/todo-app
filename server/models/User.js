const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    customCategories: { 
        type: [String], 
        default: [] 
    },
    stats: {
        totalCreated: { type: Number, default: 0 },
        totalCompleted: { type: Number, default: 0 },
        totalDeleted: { type: Number, default: 0 }
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);