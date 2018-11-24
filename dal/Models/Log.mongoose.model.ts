const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    level: Number,
    component: String,
    tags: [Schema.Types.Mixed],
    env:  String,
    message: String,
    data: Schema.Types.Mixed,
    time: Date,
});


export const Logs = mongoose.model('Logs', logSchema);