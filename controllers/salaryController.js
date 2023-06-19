import { Salary } from "../models/salaryModel";

// Create salary -- called in authController.js
export const createSalary = async (teacher) => {
  try {
    await Salary.create({ teacher: teacher._id, salary: teacher.salary });
  } catch (err) {
    console.log({ message: { error: err.message } });
  }
};

// Update salary
export const updateSalary = async (salary) => {
  try {
    await Salary.findByIdAndUpdate(salary._id, salary);
  } catch (err) {
    console.log({ message: { error: err.message } });
  }
};
