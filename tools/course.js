'use strict';
const db = require('./database');
const course = db.course;
const account = db.account;
const homework = db.homework;
const discussion = db.discussion;

class CourseController {
    static async allInOne(ctx, next) {
        let cour = await course.findById(ctx.params.id);
        let hwIds = cour.homework.map((h) => {
            return h.id;
        });
        let stuIds = cour.student.map((h) => {
            return h.id;
        });
        cour = cour.toObject();
        cour.homework = await homework.where('_id').in(hwIds).select('-course');
        cour.student = await account.where('_id').in(stuIds).select('-courseId -role -password');
        cour.discussion = (await discussion.findOne({ course: cour._id }).select('-history._id')).history;
        return ctx.body = cour;
    }

    static async getCourse(ctx, next) {
        return ctx.body = await course.findById(ctx.params.id);
    }

    static async addCourse(ctx, next) {
        let params = ctx.request.body;
        let cour = new course({
            name: params.name,
            teacher: { name: params.teacher, id: params.id }
        });
        await cour.save();
        let discuss = new discussion({ course: cour._id });
        await discuss.save();

        let teacher = await account.findById(params.id);
        teacher.courseId.push(cour._id);
        await teacher.save();

        return ctx.body = cour;
    }

    static async addStu(ctx, next) {
        let cour = await course.findById(ctx.params.id);
        let arr = JSON.parse(ctx.request.body.stus);
        for (let stu of arr) {
            console.log(stu);
            cour.student.push(stu);
            let stuAcc = await account.findById(stu.id);
            stuAcc.courseId.addToSet(cour._id);
            await stuAcc.save();
        }
        await cour.save();
        return ctx.body = cour.student;
    }

    static async allCourse(ctx, next) {
        let courseIds = (await account.findById(ctx.params.stuid))['courseId'];
        return ctx.body = await course
            .where('_id')
            .in(courseIds);
    }

    static async delStd(ctx, next) {
    }
    
    // static async addHw(ctx, next) {
    // }

    // static async delHw(ctx, next) {
    // }
};

module.exports = CourseController;
