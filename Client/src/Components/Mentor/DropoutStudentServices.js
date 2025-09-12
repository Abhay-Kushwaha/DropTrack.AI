// import axios from "axios";

// export const DropedStudentsServices = {
//   async getCustomersXLarge(schoolId) {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/getSchoolWiseStudents?schoolId=${schoolId}&status=1`
//         // `http://localhost:8000/api/students/?school_ids=${schoolId}&is_active_ne=1`
//       );
//       return response.data; // assuming backend sends array of students
//     } catch (error) {
//       console.error("Error fetching dropped students:", error);
//       return [];
//     }
//   },
// };
import axios from "axios";

export const DropedStudentsServices = {
  async getCustomersXLarge(schoolId) {
    try {
      const response = await axios.get(
        `http://localhost:3000/getSchoolWiseStudents?schoolId=${schoolId}&status=1`
      );

      // ✅ directly return the array of students
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching dropped students:", error);
      return [];
    }
  },
};
