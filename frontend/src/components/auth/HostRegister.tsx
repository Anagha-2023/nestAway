import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { hostRegisterSlice, googleHostSignIn } from "../../store/slices/hostSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { RegisterData } from "../../types/userTypes";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import Spinner from "../Spinner";

const HostRegister: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serverError = useSelector((state: RootState) => state.host.error);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false)

  const validate = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    } else if (/^0{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid number'
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password || !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must contain at least 6 characters";
      } else {
        if (!/[A-Z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one numeric value';
        }
        if (!/[!@#$%^&*]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one special character';
        }
      }
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Register Host
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true)
      console.log("Data before Dispatching:", formData);

      try {
        const result = await dispatch(hostRegisterSlice(formData) as any);

        setRegisterError(null);
        console.log("Result:", result);

        if (result.meta.requestStatus === 'fulfilled') {
          console.log("redirected SUccesfully...");

          navigate('/verify-host-otp');
        } else {
          setRegisterError(result.payload.message || 'Host already exist');
        }
      } catch (error) {
        console.log("Host Register Error:", error);
        setRegisterError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false)
      }
    }
  };

  // Google Sign-In
  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const host = result.user;

      const googleHostData = {
        email: host.email,
        name: host.displayName,
        googleId: host.uid,
      };

      const dispatchResult = await dispatch(googleHostSignIn(googleHostData) as any);

      if (dispatchResult.meta.requestStatus === 'fulfilled') {
        console.log('Navigating to login page...');
        navigate('/host-login');
      } else {
        // Display the error message from the backend
        setRegisterError(dispatchResult.payload || 'Host already registered!');
      }
    } catch (error) {
      console.error('Google sign-In error:', error);
      setRegisterError('Google sign-in failed');
    } finally {
      setGoogleLoading(false)
    }
  };


  // Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Spinner />
        </div>
      )}
      {/* Logo in the top left corner */}
      <img
        src='../src/assets/images/logo_black.png'
        alt='Logo'
        className='absolute top-5 left-5 w-20'
      />

      <div className="grid grid-cols-2 h-screen">
        <div className="flex justify-center items-center bg-white">
          <img src='../src/assets/images/host illu.avif' alt='Signup' className='w-2/3' />
        </div>

        <div className="flex justify-center items-center h-full bg-gradient-to-r from-blue-50 to-blue-500">
          <form onSubmit={handleRegister} className="w-2/3">
            {registerError && <p className="text-red-600 text-sm font-semibold text-center mb-10">{registerError}</p>}

            <h2 className="font-bold text-2xl flex justify-center items-center mb-6 font-serif">
              Join as Host!
            </h2>

            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={formData.name}
                placeholder="Enter your name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md outline-none hover:shadow-xl hover:border-blue-400"
              />
            </div>

            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            <div className="relative mb-4">
              <FaPhone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="phone"
                value={formData.phone}
                placeholder="Enter your number"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md outline-none hover:shadow-xl hover:border-blue-400"
              />
            </div>

            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <div className="relative mb-4">
              <FaEnvelope
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 p-2 border-2 shadow-md rounded-md outline-none hover:shadow-xl hover:border-blue-400"
              />
            </div>

            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <div className="relative mb-4">
              <FaLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder="Enter your password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 outline-none hover:shadow-xl hover:border-blue-400 p-2 border-2 shadow-md rounded-md"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            <div className="relative mb-4">
              <FaLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 outline-none hover:shadow-xl hover:border-blue-400 p-2 border-2 shadow-md rounded-md" />

            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-3/4 bg-gradient-to-t mb-4 from-blue-500 to-indigo-900 text-white text-xl font-bold p-2 rounded-full transform transition duration-500 ease-in-out hover:shadow-lg  hover:from-indigo-900 hover:to-blue-500 active:transition-none a active:scale-95"
              >
                Register
              </button>
            </div>


            <p onClick={() => navigate('/host-login')} className='flex justify-center mb-6 transition duration-150 ease-in-out text-gray-900  hover:text-blue-950 hover:font-semibold hover:cursor-pointer'>
              Already registered ? Login
            </p>

            <div className="flex items-center mt-4">
              <div className="flex-grow border-t border-blue-600"></div>
              <span className="mx-2 text-gray-600">or</span>
              <div className="flex-grow border-t border-blue-600"></div>
            </div>

            <div className='flex justify-center mt-4'>
              <button
                type="button"
                onClick={handleGoogleRegister}
                className='flex justify-center items-center w-2/3 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-md hover:scale-105 transition duration-300 ease-in-out'>
                <img src='../src/assets/images/google.png' alt='Google logo' className='w-6 h-6 mr-2' />
                {googleLoading ? (
                  <div className="border-4 border-t-transparent border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
                ) : (
                  <>

                    <span className='text-gray-700 font-semibold'>Register with Google</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostRegister;
