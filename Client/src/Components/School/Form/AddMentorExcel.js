import { useFormik } from "formik";
import * as Yup from "yup";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const AddMentorExcel = () => {
    const initialValues = {
        file: null,
    };

    // Validation Schema
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

    // Submit Excel File
    const onSubmit = async (values) => {
        const fileInput = document.getElementById("fileInput");
        var formdata = new FormData();
        formdata.append("excelfile", fileInput.files[0], values.file[0].name);

        var requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
        };

        fetch("http://localhost:3000/addMentorExcel", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 200) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Mentors Added Successfully",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    formik.resetForm();
                    fileInput.value = '';
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: result.err || "Make sure all required fields are filled in the Excel file.",
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to import mentors. Please check your Excel file format.",
                });
            });
    };

    // Formik hook
    const formik = useFormik({
        initialValues,
        validationSchema: fileSchema,
        onSubmit,
    });

    const handleOneFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        formik.setFieldValue("file", selectedFiles);
    };

    // Generate Excel Template
    const downloadTemplate = () => {
        const worksheet = XLSX.utils.json_to_sheet([
            {
                Name: "",
                Email: "",
                DOB: "",
                Gender: "",
                AadharNumber: "",
                ContactNumber: "",
                State: "",
                District: "",
                Taluka: "",
                City: "",
                SchoolName: "",
            },
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MentorTemplate");

        XLSX.writeFile(workbook, "MentorTemplate.xlsx");
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-3/5 mx-auto my-8 p-6 border rounded bg-gray-100 shadow-md shadow-gray-400 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-700">
                    Upload Mentor Excel File
                </h2>

                <p className="text-gray-600 text-center">
                    Please ensure your file follows the given template format before
                    uploading.
                </p>

                {/* File Input */}
                <div className="mx-5 space-y-2">
                    <label htmlFor="file" className="font-semibold text-gray-500">
                        Choose Excel File :
                    </label>
                    <input
                        id="fileInput"
                        name="file"
                        type="file"
                        onChange={handleOneFileChange}
                        onBlur={formik.handleBlur}
                        className="block w-full border p-2 rounded-md"
                    />
                    {formik.touched.file && formik.errors.file && (
                        <div style={{ color: "red" }}>{formik.errors.file}</div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mx-5">
                    <button
                        type="submit"
                        className="bg-blue-700 text-white font-bold tracking-wider py-2 px-6 rounded-md hover:bg-blue-600 uppercase"
                    >
                        Submit
                    </button>

                    <button
                        type="button"
                        onClick={downloadTemplate}
                        className="bg-green-600 text-white font-bold tracking-wider py-2 px-6 rounded-md hover:bg-green-500 uppercase"
                    >
                        Download Template
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddMentorExcel;