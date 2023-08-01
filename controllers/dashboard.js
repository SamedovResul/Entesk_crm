import { Course } from "../models/courseModel.js";
import { Lesson } from "../models/lessonModel.js";
import { ProfileImage } from "../models/profileImageModel.js";
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
    // console.log(cancelledLessons,'1')
    // console.log(confirmedLessons,'2')
    // console.log(confirmedLessonsOfMonth,'3')
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
    // console.log(studentsCountAz,'4')
    // console.log(studentsCountEn,'5')
    // console.log(studentsCountRu,'6')
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
    // console.log(studentsCountFromInstagram,'8')
    // console.log(studentsCountFromReferral,'9')
    // console.log(studentsCountFromEvent,'10')
    // console.log(studentsCountFromExternalAdvertising,'11')
    // console.log(studentsCountFromOther,'12')
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
    console.log(confirmedLessonsOfMonth);
    confirmedLessonsOfMonth.forEach((lesson) => {
      const studentsCount = lesson.students.filter(
        (item) => item.attendance === 1
      ).length;
      console.log(lesson);
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
        userId: secondTeacher._id,
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

    // console.log(firstTeacher,'1');
    // console.log(secondTeacher,'2');
    // console.log(thirdTeacher,'3');
    // console.log(profileImages,'4');
    // console.log(profileImagesObjList,'5');
    // console.log(firstProfileImage,'6');
    // console.log(secondProfileImage,'7');
    // console.log(thirdProfileImage,'8');
    // console.log(topTeachers,'9');
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
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
