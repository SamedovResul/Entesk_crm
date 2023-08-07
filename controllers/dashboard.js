import { Course } from "../models/courseModel.js";
import { Expense } from "../models/expenseModel.js";
import { Lesson } from "../models/lessonModel.js";
import { ProfileImage } from "../models/profileImageModel.js";
import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";

export const getDahsboardData = async (req, res) => {
  // const { startDate, endDate } = req.query;
  const startDate = null,
    endDate = null;
  console.log(1);
  try {
    let dateFilterObj;

    const startOfMonth = new Date();
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    console.log(2);
    if (startDate && endDate) {
      dateFilterObj.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      dateFilterObj.date = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }
    console.log(3);
    //  get confirmed and cancelled lessons
    const confirmedLessons = await Lesson.find({
      ...dateFilterObj,
      status: "confirmed",
    });
    console.log(1);
    const cancelledLessons = await Lesson.find({
      ...dateFilterObj,
      status: "cancelled",
    });

    // get students count for sector
    const studentsCountAz = await Student.countDocuments({
      ...dateFilterObj,
      status: true,
      sector: "AZ",
    });
    const studentsCountEn = await Student.countDocuments({
      ...dateFilterObj,
      status: true,
      sector: "EN",
    });
    const studentsCountRu = await Student.countDocuments({
      ...dateFilterObj,
      status: true,
      sector: "RU",
    });

    // get disabled students count

    const disabledStudentsCount = await Student.countDocuments({
      ...dateFilterObj,
      status: false,
    });

    // get teachers count
    const teachersCount = await Teacher.countDocuments(dateFilterObj);

    // get students count for where coming
    const studentsCountFromInstagram = await Student.countDocuments({
      ...dateFilterObj,
      whereComing: "instagram",
    });
    const studentsCountFromReferral = await Student.countDocuments({
      ...dateFilterObj,
      whereComing: "referral",
    });
    const studentsCountFromEvent = await Student.countDocuments({
      ...dateFilterObj,
      whereComing: "event",
    });
    const studentsCountFromExternalAdvertising = await Student.countDocuments({
      ...dateFilterObj,
      whereComing: "externalAds",
    });
    const studentsCountFromOther = await Student.countDocuments({
      ...dateFilterObj,
      whereComing: "other",
    });

    // get courses and they students count
    const courses = await Course.find(dateFilterObj);

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

    // expneses
    const expenses = await Expense.find(dateFilterObj);
    const expensesValue = expenses.reduce(
      (total, expense) => (total += expense.value),
      0
    );

    const earnings = confirmedLessons.reduce((total, curr) => {
      return (total += curr?.earnings || 0);
    }, 0);

    const obj = {};

    confirmedLessons.forEach((lesson) => {
      const studentsCount = lesson.students.filter(
        (item) => item.attendance === 1
      ).length;

      obj[lesson.teacher] = obj[lesson.teacher]
        ? obj[lesson.teacher] + studentsCount
        : studentsCount;
    });

    const sortedData = Object.entries(obj).sort((a, b) => b[1] - a[1]);

    let firstTeacher = null;
    let secondTeacher = null;
    let thirdTeacher = null;

    if (sortedData.length > 2) {
      if (sortedData[2][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
        secondTeacher = await Teacher.findById(sortedData[1][0]);
        thirdTeacher = await Teacher.findById(sortedData[2][0]);
      } else if (sortedData[1][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
        secondTeacher = await Teacher.findById(sortedData[1][0]);
      } else if (sortedData[0][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
      }
    } else if (sortedData.length === 2) {
      if (sortedData[1][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
        secondTeacher = await Teacher.findById(sortedData[1][0]);
      } else if (sortedData[0][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
      }
    } else if (sortedData.length === 1) {
      if (sortedData[0][1] > 0) {
        firstTeacher = await Teacher.findById(sortedData[0][0]);
      }
    }

    let firstProfileImage = null;
    let secondProfileImage = null;
    let thirdProfileImage = null;

    if (firstTeacher) {
      const profileImage = await ProfileImage.findOne({
        userId: firstTeacher._id,
      });

      firstProfileImage =
        profileImage &&
        Buffer.from(profileImage?.profileImage).toString("base64");
    }

    if (secondTeacher) {
      const profileImage = await ProfileImage.findOne({
        userId: secondTeacher._id,
      });

      secondProfileImage =
        profileImage &&
        Buffer.from(profileImage?.profileImage).toString("base64");
    }

    if (thirdTeacher) {
      const profileImage = await ProfileImage.findOne({
        userId: thirdTeacher._id,
      });

      thirdProfileImage =
        profileImage &&
        Buffer.from(profileImage?.profileImage).toString("base64");
    }

    const topTeachers = {
      first: {
        teacher: firstTeacher,
        studentsCount: sortedData[0] && sortedData[0][1],
        profileImage: firstProfileImage,
      },
      second: {
        teacher: secondTeacher,
        studentsCount: sortedData[1] && sortedData[1][1],
        profileImage: secondProfileImage,
      },
      third: {
        teacher: thirdTeacher,
        studentsCount: sortedData[2] && sortedData[2][1],
        profileImage: thirdProfileImage,
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
      disabledStudentsCount,
      allStudentsCount: studentsCountAz + studentsCountEn + studentsCountRu,
      studentsCountAz,
      studentsCountEn,
      studentsCountRu,
      earnings,
      topTeachers,
      studentsCountByWhereComing,
      coursesInfo,
      teachersCount,
      expensesValue,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: { error: err.message } });
  }
};

getDahsboardData();
