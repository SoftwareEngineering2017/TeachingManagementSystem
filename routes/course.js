'use strict';
var router = require('koa-router')();
router.prefix('/course');

const course = require('../tools/course');

router.get('/:id', course.getCourse)
    /* params
        name: String
        teacher(name): String, id(teacher's): ObjectId
    */
    .post('/', course.addCourse)
    // params: stus: [{name: String, id: ObjectId}]
    .put('/:id/stu', course.addStu)
    // not implemented yet
    .del('/:id/stu', course.delStd);

router.get('/allInOne/:id', course.allInOne);

router.get('/allCourse/:stuid', course.allCourse);


/*
router.put('/upload/:id/:name', course.upload);
        .get('/download/:id/:name, course.download);

*/
// router.redirect('/', '/');

module.exports = router;