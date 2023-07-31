import { Course } from "../models/courseModel.js";
import { Lesson } from "../models/lessonModel.js";
import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";

export const getDahsboardData = async (req, res) => {
  //   const startOfMonth = new Date();
  //   const endOfMonth = new Date();
  //   startOfMonth.setMonth(startOfMonth.getMonth() - 1);
  //   startOfMonth.setDate(1);
  //   startOfMonth.setHours(0, 0, 0, 0);
  //   endOfMonth.setDate(0);
  //   endOfMonth.setHours(23, 59, 59, 999);

  try {
    //  get confirmed and cancelled lessons
    const confirmedLessons = await Lesson.find({ status: "confirmed" });
    const confirmedLessonsOfMonth = await Lesson.find({
      status: "confirmed",
    });
    const cancelledLessons = await Lesson.find({ status: "cancelled" });

    // get students count for sector
    const studentsCountAz = await Student.countDocuments({
      status: true,
      sector: "AZ",
    });
    const studentsCountEn = await Student.countDocuments({
      status: true,
      sector: "EN",
    });
    const studentsCountRu = await Student.countDocuments({
      status: true,
      sector: "RU",
    });

    // get teachers count

    const teachersCount = await Teacher.countDocuments();

    // get students count for where coming
    const studentsCountFromInstagram = await Student.countDocuments({
      whereComing: "instagram",
    });
    const studentsCountFromReferral = await Student.countDocuments({
      whereComing: "referral",
    });
    const studentsCountFromEvent = await Student.countDocuments({
      whereComing: "event",
    });
    const studentsCountFromExternalAdvertising = await Student.countDocuments({
      whereComing: "externalAds",
    });
    const studentsCountFromOther = await Student.countDocuments({
      whereComing: "other",
    });

    // get courses and they students count
    const courses = await Course.find();

    const coursesInfo = await Promise.all(
      courses.map(async (course) => {
        const studentsCountForCourse = await Student.countDocuments({
          courses: course._id,
        });

        return {
          course: course.toObject(),
          studentsCount: studentsCountForCourse,
        };
      })
    );

    const earnings = confirmedLessons.reduce((total, curr) => {
      return (total += curr?.earnings || 0);
    }, 0);

    const lostMoney = cancelledLessons.reduce((total, curr) => {
      return (total += curr?.earnings || 0);
    }, 0);

    const obj = {};

    confirmedLessonsOfMonth.forEach((lesson) => {
      const studentsCount = lesson.students.filter(
        (item) => item.attendance === 1
      ).length;

      obj[lesson.teacher] = obj[lesson.teacher]
        ? obj[lesson.teacher] + studentsCount
        : studentsCount;
    });

    const sortedData = Object.entries(obj).sort((a, b) => b[1] - a[1]);

    const firstTeacher = await Teacher.findById(
      sortedData[0] && sortedData[0][0]
    );
    console.log(1);
    const secondTeacher = await Teacher.findById(
      sortedData[1] && sortedData[1][0]
    );
    console.log(2);
    const thirdTeacher = await Teacher.findById(
      sortedData[2] && sortedData[2][0]
    );
    console.log(3);

    const topTeachers = {
      first: {
        teacher: firstTeacher,
        studentsCount: sortedData[0] && sortedData[0][1],
      },
      second: {
        teacher: secondTeacher,
        studentsCount: sortedData[1] && sortedData[1][1],
      },
      third: {
        teacher: thirdTeacher,
        studentsCount: sortedData[2] && sortedData[2][1],
      },
    };

    const studentsCountByWhereComing = {
      studentsCountFromInstagram,
      studentsCountFromEvent,
      studentsCountFromReferral,
      studentsCountFromExternalAdvertising,
      studentsCountFromOther,
    };

    const result = {
      confirmedLessonCount: confirmedLessons.length,
      cancelledLessonCount: cancelledLessons.length,
      allStudentsCount: studentsCountAz + studentsCountEn + studentsCountRu,
      studentsCountAz,
      studentsCountEn,
      studentsCountRu,
      earnings,
      topTeachers,
      studentsCountByWhereComing,
      coursesInfo,
      teachersCount,
      lostMoney,
    };

    console.log(result);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
