const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    topic: {type: String, required: [true, 'topic is required']},
    details: {type: String, required: [true, 'content is required'], minLength: [10, 'the content should have at least 10 characters']},
    date: {type: String, required: [true, 'date is required']},
    hostName: {type: String, required: [true, 'host is required']},
    startTime: {type: String, required: [true, 'time is required']},
    author: {type: Schema.Types.ObjectId, ref:'User'},
    location: {type: String, required: [true, 'location is required']}
});

module.exports = mongoose.model('connection', connectionSchema);