import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginValidationSchemas } from "../Schemas";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import image from "./../Assets/education.png";
import { UserActions } from "../Store/UserData";
const initialValues = {
  Email: "",
  Password: "",
};

const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

const Login = () => {
  // This style block injects the keyframes for the gradient animation
  const animationStyle = `
        @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animated-gradient {
            background-size: 200% 200%;
            animation: gradient-move 10s ease infinite;
        }
    `;

  // Base styles for input fields for consistency
  const inputStyles = "w-full rounded-lg border bg-slate-50 py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors";
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const LoginHandler = (values) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      Email: values.Email,
      Password: values.Password,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:3000/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const errorCode = result.rcode;
        if (errorCode === -9) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Credentials",
            timer: 1500,
            // footer: '<a href="">Why do I have this issue?</a>',
          });
        }
        //0 Admin , 1 State level  , 2 District level ,  3 Taluka level , 4 city level ,5 School
        if (errorCode === 200) {
          dispatch(UserActions.getuserdata(result.data));
          localStorage.setItem("token", result.token);
          if (result.data.Role === 0) {
            navigate("/admin");
          } else if (result.data.Role === 1) {
            navigate("/authority");
          } else if (result.data.Role === 2) {
          } else if (result.data.Role === 3) {
          } else if (result.data.Role === 4) {
          } else if (result.data.Role === 5) {
            navigate("/school");
          } else if (result.data.Role === 6) {
            navigate("/student");
          } else if (result.data.Role === 7) {
            navigate("/mentor");
          } else if (result.data.Role === 8) {
            navigate("/parent");
          }
        }
      })
      .catch((error) => console.log("error", error));
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LoginValidationSchemas,
      onSubmit: (values, action) => {
        console.log(values);
        LoginHandler(values);
        action.resetForm();
      },
    });
  return (
    <>
      <style>{animationStyle}</style>
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Panel: Animated Gradient & Image */}
          <div className="animated-gradient hidden flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 p-12 text-white lg:flex">
            <div className="text-center">
              <img src={image} alt="Dropout Analysis Portal Symbol" className="mx-auto mb-6 h-24 w-auto" />
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="mt-2 max-w-xs opacity-80">
                Unlocking insights to ensure every student succeeds.
              </p>
            </div>
          </div>

          {/* Right Panel: Sign-In Form */}
          <div className="flex w-full flex-col items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md">
              <h1 className="mb-4 text-center text-3xl font-bold text-slate-800">
                Sign In
              </h1>
              <p className="mb-8 text-center text-slate-500">
                Enter your credentials to access the portal.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="mb-2 block font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <MailIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete="email"
                      name="Email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputStyles}
                      value={values.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.Email && touched.Email && (
                    <small className="mt-1.5 text-red-500">{errors.Email}</small>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2 block font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete="current-password"
                      name="Password"
                      type="password"
                      placeholder="••••••••"
                      className={inputStyles}
                      value={values.Password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.Password && touched.Password && (
                    <small className="mt-1.5 text-red-500">{errors.Password}</small>
                  )}
                </div>

                <div className="mb-5">
                  <button
                    className="w-full rounded-lg bg-orange-500 py-3 text-lg font-bold text-white tracking-wide transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>

                {/* <p className="text-center text-sm text-slate-500">
                  Forgot your password?{' '}
                  <a href="#" className="font-semibold text-orange-500 hover:underline">
                    Reset it here
                  </a>
                </p> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;