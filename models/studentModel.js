const mongoose = require('mongoose');
const conn = require('../db_connection');


const course_schema = new mongoose.Schema({
    cid: { type: String, required: true },
    grade: { type: Number, required: true }
});

const student_schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    toar: { type: String, required: true, enum: ['ba', 'ma', 'phd'] },
    courses: [course_schema]
}, { collection: 'students' });



// const Student = mongoose.model('', student_schema);
const Student = conn.academy_connection.model('', student_schema);







module.exports = Student;
