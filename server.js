const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const students_router = require('./routes/student_router');
const cors = require('cors');
const Log = require('./models/logModel');

/**
 * db connection is handled in db_connection.js
 * and passed to the models files (student and log)
 * it creates connection before using the db either for reading or saving
 */


//express app
const app = express();


//asign runmode value (JSON or HTML) depending on argv value
(process.argv[2] == '--json') ? global.runmode = 'JSON' : global.runmode = "HTML";


//parser
if (global.runmode == 'HTML') {
    //for parsing request data in normal html mode     
    const urlencodedParser = express.urlencoded({ extended: false });
    app.use(urlencodedParser);
}
else if (global.runmode == 'JSON') {
    //for parsing request data in json mode
    app.use(express.json());
}



app.use(cors());    //for wroking with both port 8080 and local server in the same time


//set view engine
app.set('view engine', 'pug');



//path for statuc files
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));




//log function
app.use(server_log);

function server_log(req, res, next) {
    //creating new log using log schema
    const log = new Log({
        method: req.method, path: req.path, runmode: global.runmode, when: Date.now()
    });

    //saving log to DB
    log.save()
        .then((result) => {
            // console.log('Successfully saved log', result);
        }).catch((err) => {
            console.log(err);
        });
    next();
}



//student routes file
app.use("/student", students_router);


app.use(function (req, res, next) {
    res.status(404).render("404");
});




app.listen(8080, () => {
    console.log('Listening on port 8080...');
});








/*
//multiple database connections is handled in db_connection.js helper file
//this code for one database connection (I keep it in comment as a reference)
mongoose.connect(uri_academy, options).then((result) => {
    app.listen(8080, () => {
        console.log('Listening on port 8080...DB=Academy');
    });
}).catch((err) => {
    console.log(err);
});
*/

