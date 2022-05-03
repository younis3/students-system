const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const router = express.Router();




//GET routes
router.get('/', (req, res) => {
    Student.find()
        .then((result) => {
            //console.log(result);
            if (global.runmode == 'HTML') {
                res.render('list_students', { res: result });
            }
            else if (global.runmode == 'JSON') {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }

        }).catch((err) => {
            console.log(err);
        });

});




router.get('/add', (req, res) => {
    //was not required to take care of this route in json mode (according to exercise document)
    res.render('add_student', { toar: 'BA' });  //added default selected toar value for better user interface in new empty form
});






router.get('/update/:id', (req, res) => {

    const url_id = req.params.id;

    //get student details from db
    Student.findById(url_id)
        .then(result => {
            //console.log(result);
            const student_id = result.id;
            const name = result.name;
            const city = result.city;
            const toar = result.toar.toUpperCase();
            const courses = result.courses;

            //was not required to take care of this route in json mode (according to exercise document)
            res.render('update_student', {
                pageid: url_id, student_id: student_id, name: name, city: city, toar: toar,
                courses: courses
            });
        }).catch(err => {
            console.log(err);
        });

});







//POST routes

router.post('/', (req, res) => {

    //get form values
    let toar = (req.body.toar) ? req.body.toar.toLowerCase() : "all";
    let city = (req.body.city) ? req.body.city : "";
    let req_avg = (req.body.avg) ? req.body.avg : "";


    //filter
    let filter = { "$expr": { "$and": [] } };

    if (toar != 'all') {
        filter['$expr']["$and"].push({ "$eq": ["$toar", toar] });
    }

    if (city != '') {
        filter['$expr']["$and"].push({ "$eq": ["$city", city] });
    }

    //minimum avg filter logic is written below after getting result from find method



    let query = Student.find(filter);
    query.exec()
        .then((result) => {
            // console.log(result);

            //if user added a minimum avg grade to filter
            if (req_avg != "") {
                /**
                 * this code loops through all courses for each student, calculates the student average and renders 
                 * new page with new array where average match
                 */
                let final_arr = [];
                if (result) {
                    result.forEach(student => {
                        let student_avg;
                        if (student.courses.length != 0) {
                            let student_total_grade = 0;
                            student.courses.forEach(course => {
                                student_total_grade += course.grade;
                            })
                            student_avg = student_total_grade / student.courses.length
                            // console.log('student avg:', student_avg);
                            // console.log('student id', (student._id).toString());
                        }
                        if (student_avg >= req_avg) {
                            final_arr.push(student);
                        }
                    })
                    // console.log(final_arr);
                    if (global.runmode == 'HTML') {
                        res.render('list_students', { res: final_arr });
                    }
                    else if (global.runmode == 'JSON') {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(final_arr));
                    }
                }
            }
            //user didn't type a minimum avg grade to filter
            else {
                if (global.runmode == 'HTML') {
                    res.render('list_students', { res: result });
                }
                else if (global.runmode == 'JSON') {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })

});





router.post('/add', (req, res) => {

    //get form values
    let id = (req.body.id) ? req.body.id : "";
    let name = (req.body.name) ? req.body.name : "";
    let city = (req.body.city) ? req.body.city : "";
    let toar = (req.body.toar) ? req.body.toar.toLowerCase() : "";


    //creating new student using student schema
    const student = new Student({
        id: id, name: name, city: city, toar: toar,
        courses: []
    });

    //saving to DB
    student.save()
        .then((result) => {
            if (global.runmode == 'HTML') {
                res.render('add_student', { id: id, name: name, city: city, toar: toar.toUpperCase() });
            }
            else if (global.runmode == 'JSON') {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }
        }).catch((err) => {
            if (global.runmode == 'HTML') {
                console.log(err);
            }
            else if (global.runmode == 'JSON') {
                res.setHeader('Content-Type', 'application/json');
                res.send("FAIL");
            }
        });

});



//update student
router.post('/update/:id', (req, res) => {

    let object_id = (req.params.id) ? req.params.id : "";     //get object _id
    let action = (req.body.action) ? req.body.action : "";    //get required action


    //if user clicked on update student button
    if (action == 'updatestudent') {
        //asign all form inputs to variables (no need for student id since it shoudn't be changed)
        let name = (req.body.name) ? req.body.name : "";
        let city = (req.body.city) ? req.body.city : "";
        let toar = (req.body.toar) ? req.body.toar.toLowerCase() : "";


        //creating student object
        const student = {
            name: name, city: city, toar: toar
        };


        Student.findByIdAndUpdate(object_id, student, { new: true })        //new:true return updated document to server result
            .then((result) => {
                // console.log(result);
                console.log("updated successfully");
                if (global.runmode == 'HTML') {
                    res.redirect(`/student/update/${object_id}`)
                }
                else if (global.runmode == 'JSON') {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }
            })
            .catch((err) => {
                if (global.runmode == 'HTML') {
                    console.log(err);
                }
                else if (global.runmode == 'JSON') {
                    res.setHeader('Content-Type', 'application/json');
                    res.send("FAIL");
                }
            })


        /*
     //  this is another way of writing code as shown in lectures just to keep this as a reference
     //  I prefer to work with the "then" and "catch" way
     
        Student.findByIdAndUpdate(object_id, student, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(doc);
            console.log("updated successfully");
            res.redirect('/student')
        }
        })
        */

    }


    //if user clicked on add course button
    else if (action == 'addcourse') {

        let course_id = (req.body.courseid) ? req.body.courseid : "";
        let grade = (req.body.grade) ? req.body.grade : "";


        //creating Grade object
        const course = { cid: course_id, grade: grade }

        Student.findByIdAndUpdate(object_id, { $push: { courses: course } }, { new: true })
            .then((result) => {
                // console.log(result);
                console.log("course added successfully");
                if (global.runmode == 'HTML') {
                    res.redirect(`/student/update/${object_id}`)
                }
                else if (global.runmode == 'JSON') {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }
            })
            .catch((err) => {
                if (global.runmode == 'HTML') {
                    console.log(err);
                }
                else if (global.runmode == 'JSON') {
                    res.setHeader('Content-Type', 'application/json');
                    res.send("FAIL");
                }
            })

    }


});





//delete student
router.post('/delete/:id', (req, res) => {

    let object_id = (req.params.id) ? req.params.id : "";     //get object _id

    Student.findByIdAndDelete(object_id)
        .then((result) => {
            if (global.runmode == 'HTML') {
                res.redirect('/student');
            }
            else if (global.runmode == 'JSON') {
                res.setHeader('Content-Type', 'application/json');
                res.send("1");
            }
        })
        .catch((err) => {
            if (global.runmode == 'HTML') {
                console.log(err);
            }
            else if (global.runmode == 'JSON') {
                res.setHeader('Content-Type', 'application/json');
                res.send("0");
            }
        });

});













module.exports = router;

