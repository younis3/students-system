const mongoose = require('mongoose');
const conn = require('../db_connection');



const log_schema = new mongoose.Schema({
    method: { type: String, required: true },
    path: { type: String, required: true },
    runmode: { type: String, required: true },
    when: { type: Date, default: Date.now() }
}, { collection: 'log' });



const Log = conn.academy_log_connection.model('', log_schema);






module.exports = Log;
