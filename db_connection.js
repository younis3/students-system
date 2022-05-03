/**
 * file helper for db connections
 */

const mongoose = require('mongoose');



//DB connection
const uri_academy = 'mongodb://localhost/academy';
const uri_academyLog = 'mongodb://localhost/academylog';
const options = { useNewUrlParser: true, useUnifiedTopology: true };




//connection to multiple databases

mongoose.academy_connection = mongoose.createConnection(uri_academy, options)


mongoose.academy_log_connection = mongoose.createConnection(uri_academyLog, options)






module.exports = mongoose;
