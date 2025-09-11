import { useFormik } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const AddStudentExcel = () => {
  const initialValues = {
    file: null,
  };

  const fileSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("File is required")
      .test(
        "fileType",
        "Only Excel or CSV files are allowed",
        (value) =>
          value &&
          (value[0].type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            value[0].type === "text/csv")
      )
      .test(
        "fileSize",
        "File size must be less than 5MB",
        (value) => value && value[0].size <= 5242880
      ),
  });

  const onSubmit = async (values) => {
    const fileInput = document.getElementById("fileInput");
    var formdata = new FormData();
    formdata.append("excelfile", fileInput.files[0], values.file[0].name);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:3000/addStudentExcel", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Students Added Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          formik.resetForm();
          fileInput.value = '';
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.err || "Make sure all required fields including Parent's Email are filled in the Excel file.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to import students. Please check your Excel file format.",
        });
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: fileSchema,
    onSubmit,
  });

  const handleOneFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    formik.setFieldValue("file", selectedFiles);
  };

  // Download template function
  const downloadTemplate = () => {
    const headers = [
      [
        "RollNumber",
        "Name",
        "Email",
        "DOB",
        "Gender",
        "AadharNumber",
        "ParentOccupation",
        "ParentMaritalStatus",
        "ParentPhone",
        "ParentEmail",
        "ContactNumber",
        "Address",
        "Caste",
        "Disability",
        "FamilyIncome",
        "Standard",
        "SchoolName",
        "State",
        "District",
        "Taluka",
        "City",
        "AttendancePercentage",
        "FatherEducation",
        "MotherEducation",
        "IsRepeated"
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Student_Template.xlsx");
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="min-w-fit w-3/5 mx-auto my-8 p-6 border rounded bg-white shadow-lg space-y-6">
        {/* Heading */}
        <h2 className="text-xl font-bold text-gray-700 text-center">
          Upload Student Data via Excel
        </h2>

        {/* Upload Section */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="file" className="font-semibold text-gray-600">
            Choose Excel File :
          </label>
          <input
            id="fileInput"
            name="file"
            type="file"
            onChange={handleOneFileChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded-md focus:outline-2 focus:outline-blue-500"
          />
          {formik.touched.file && formik.errors.file && (
            <div className="text-red-500 text-sm">{formik.errors.file}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-700 text-white font-bold tracking-wider py-2 px-6 rounded-md hover:bg-blue-600 uppercase"
          >
            Upload
          </button>

          <button
            type="button"
            onClick={downloadTemplate}
            className="bg-green-600 text-white font-bold tracking-wider py-2 px-6 rounded-md hover:bg-green-500 uppercase"
          >
            Download Template
          </button>
        </div>

        {/* Info */}
        <p className="text-gray-500 text-sm text-center">
          Please ensure your Excel file follows the required format. Use the
          provided template for smooth uploads.
        </p>
      </div>
    </form>
  );
};

export default AddStudentExcel;
