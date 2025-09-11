import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Addreasons = () => {
    const formik = useFormik({
        initialValues: {
            reason: '',
            subReasons: [''],
        },
        validationSchema: Yup.object({
            reason: Yup.string().required('Reason is required'),
            subReasons: Yup.array().of(Yup.string().required('Sub-reason is required')),
        }),
        onSubmit: (values, action) => {
            console.log(values);
            fetch("http://localhost:3000/addReason", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: values.reason, category: values.subReasons }),
            })
                .then(res => res.text())
                .then(() => action.resetForm())
                .catch(err => console.log('error', err));
        },
    });

    const addSubReason = () => {
        formik.setFieldValue('subReasons', [...formik.values.subReasons, '']);
    };

    const removeSubReason = (index) => {
        const updated = [...formik.values.subReasons];
        updated.splice(index, 1);
        formik.setFieldValue('subReasons', updated);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
                    Add Reasons
                </h2>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Reason Input */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Reason
                        </label>
                        <input
                            type="text"
                            name="reason"
                            placeholder="Enter Reason"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.reason}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        {formik.touched.reason && formik.errors.reason && (
                            <p className="text-red-500 mt-1 text-sm">{formik.errors.reason}</p>
                        )}
                    </div>

                    {/* Sub-reasons */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Sub-reasons
                        </label>
                        {formik.values.subReasons.map((sub, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    name={`subReasons.${index}`}
                                    placeholder="Enter Sub-reason"
                                    value={formik.values.subReasons[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                <button
                                    type="button"
                                    onClick={addSubReason}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    + Add
                                </button>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSubReason(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        {formik.touched.subReasons && formik.errors.subReasons && (
                            <p className="text-red-500 mt-1 text-sm">{formik.errors.subReasons}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all uppercase tracking-wide"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Addreasons;
