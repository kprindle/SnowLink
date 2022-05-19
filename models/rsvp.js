const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    rsvp: {type: String, required:[true, 'RSVP is required']},
    connection: {type: Schema.Types.ObjectId, ref:'connection', required:[true, 'connection is required']},
    user: {type: Schema.Types.ObjectId, ref:'User', required:[true, 'user is required']}
}, {timestamps:true});

module.exports = mongoose.model('rsvp', rsvpSchema);