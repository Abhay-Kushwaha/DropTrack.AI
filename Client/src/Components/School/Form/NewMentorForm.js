import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../Store/axios";
// import axios from "axios";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "react-datepicker/dist/react-datepicker.css";
import AddMentorExcel from "./AddMentorExcel";
import FetchState from "../../../API/FetchState";
import FetchDistrict from "../../../API/FetchDistrict";
import FetchTaluka from "../../../API/FetchTaluka";
import FetchCity from "../../../API/FetchCity";
import { useSelector } from "react-redux";

// Validation Schema
const MentorValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    middleName: Yup.string().required("Middle name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date().required("Date of birth is required"),
    aadharCard: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
        .required("Aadhar number is required"),
    contactNumber: Yup.string()
        .matches(/^\d{10}$/, "Contact number must be 10 digits")
        .required("Contact number is required"),
});

const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: null,
    aadharCard: "",
    contactNumber: "",
};

const NewMentorForm = () => {
    const [stateName, setStateName] = useState([]);
    const [TalukaName, setTalukaName] = useState([]);
    const [DistrictName, setDistrictName] = useState([]);
    const [CityName, setCityName] = useState([]);

    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedTaluka, setSelectedTaluka] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const schoolData = useSelector((state) => state.user.user);
    const sId = schoolData.School._id;

    const handleSubmit = async (values, action) => {
        try {
            // Validate location fields
            if (!selectedState || !selectedDistrict || !selectedTaluka || !selectedCity) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Please select all location fields (State, District, Taluka, and City)",
                });
                return;
            }

            const mentorData = {
                Name: `${values.firstName} ${values.middleName} ${values.lastName}`,
                Email: values.email,
                DOB: values.dob ? new Date(values.dob).toISOString() : null,
                Gender: values.gender,
                AadharNumber: values.aadharCard,
                ContactNumber: values.contactNumber,
                SubjectSpecialization: values.subjectSpecialization,
                Standards: values.standards,
                State: selectedState,
                District: selectedDistrict,
                Taluka: selectedTaluka,
                City: selectedCity,
                SchoolID: [sId],
            };

            const response = await axios.post("/addMentor", mentorData);
            // const response = await axios.post("http://localhost:3000/addMentor", mentorData);

            if (response.data.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Mentor Added Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });

                action.resetForm();
                setSelectedState("");
                setSelectedDistrict("");
                setSelectedTaluka("");
                setSelectedCity("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.data.err || "Something went wrong!",
                });
            }
        } catch (error) {
            console.error("Error adding mentor:", error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message,
            });
        }
    };

    useEffect(() => {
        FetchState().then((res) => {
            setStateName(res);
        });
    }, []);

    return (
        <>
            <AddMentorExcel />
            <Formik
                initialValues={initialValues}
                validationSchema={MentorValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="min-w-fit w-3/5 mx-auto my-8 p-8 border rounded bg-orange-50 shadow-lg shadow-orange-200 space-y-5">
                        <div className="text-2xl font-bold text-orange-600 text-center mb-6">
                            New Mentor Registration
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="firstName" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    First Name
                                </label>
                                <Field
                                    type="text"
                                    name="firstName"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="middleName" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Middle Name
                                </label>
                                <Field
                                    type="text"
                                    name="middleName"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="middleName" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="lastName" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Last Name
                                </label>
                                <Field
                                    type="text"
                                    name="lastName"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="email" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Gender
                                </label>
                                <div className="w-2/3 space-x-4">
                                    <label className="inline-flex items-center">
                                        <Field type="radio" name="gender" value="male" className="form-radio text-orange-500" />
                                        <span className="ml-2 text-orange-700">Male</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <Field type="radio" name="gender" value="female" className="form-radio text-orange-500" />
                                        <span className="ml-2 text-orange-700">Female</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <Field type="radio" name="gender" value="other" className="form-radio text-orange-500" />
                                        <span className="ml-2 text-orange-700">Other</span>
                                    </label>
                                </div>
                            </div>
                            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="dob" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Date of Birth
                                </label>
                                <Field name="dob">
                                    {({ field, form }) => (
                                        <Calendar
                                            id="dob"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => form.setFieldValue("dob", e.value)}
                                            showIcon
                                            className="w-2/3"
                                            maxDate={new Date()}
                                            style={{ width: "300px" }}
                                        />
                                    )}
                                </Field>
                            </div>
                            <ErrorMessage name="dob" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="aadharCard" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Aadhar Number
                                </label>
                                <Field
                                    type="text"
                                    name="aadharCard"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="aadharCard" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="mb-4">
                            <div className="flex">
                                <label htmlFor="contactNumber" className="w-1/3 text-orange-700 text-md font-bold mb-2">
                                    Contact Number
                                </label>
                                <Field
                                    type="text"
                                    name="contactNumber"
                                    className="w-2/3 border-solid border-2 border-orange-200 float-right rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                            <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm text-center" />
                        </div>

                        <div className="space-y-4">
                            <label className="flex mb-4">
                                <span className="text-orange-700 font-bold w-1/3">Select State</span>
                                <select
                                    className="w-2/3 p-2 border-2 border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        FetchDistrict(e.target.value).then((res) => {
                                            setDistrictName(res);
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {stateName.map((item, index) => (
                                        <option key={index} value={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex mb-4">
                                <span className="text-orange-700 font-bold w-1/3">Select District</span>
                                <select
                                    className="w-2/3 p-2 border-2 border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    value={selectedDistrict}
                                    onChange={(e) => {
                                        setSelectedDistrict(e.target.value);
                                        FetchTaluka(selectedState, e.target.value).then((res) => {
                                            setTalukaName(res);
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Select District</option>
                                    {DistrictName.map((item, index) => (
                                        <option key={index} value={item._id}>
                                            {item.district}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex mb-4">
                                <span className="text-orange-700 font-bold w-1/3">Select Taluka</span>
                                <select
                                    className="w-2/3 p-2 border-2 border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    value={selectedTaluka}
                                    onChange={(e) => {
                                        setSelectedTaluka(e.target.value);
                                        FetchCity(selectedState, selectedDistrict, e.target.value).then((res) => {
                                            setCityName(res);
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Select Taluka</option>
                                    {TalukaName.map((item, index) => (
                                        <option key={index} value={item._id}>
                                            {item.taluka}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex mb-4">
                                <span className="text-orange-700 font-bold w-1/3">Select City</span>
                                <select
                                    className="w-2/3 p-2 border-2 border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                                    value={selectedCity}
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">Select City/Village</option>
                                    {CityName.map((item, index) => (
                                        <option key={index} value={item._id}>
                                            {item.city}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="mt-6 flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wider py-2 px-6 rounded-md transition-colors duration-200"
                            >
                                Register Mentor
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default NewMentorForm;
