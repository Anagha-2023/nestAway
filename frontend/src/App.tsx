import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./pages/Home";
import UserLoginPage from "./pages/UserLoginpage";
import UserRegisterpage from "./pages/UserRegisterpage";
import VerifyOtp from "./components/auth/otpVerification";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AdminLogin from "./pages/AdminLoginpage";
import AdminDashboard from "./components/admin/AdminDashboard";
import HostRegister from "./components/auth/HostRegister";
import VerifyHostOtp from "./components/auth/verifyHostotp";
import HostLogin from "./components/auth/HostLogin";
import HostHome from "./components/auth/HostHome";
import UserManagement from "./components/admin/UserManagement";
import ProtectedRoute from "./services/ProtectedRoute";
import HostManagement from "./components/admin/HostManagement";

const App: React.FC = () => {
  return(
    <Router>

      <Routes>  
        {/* Auth */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<UserLoginPage/>}/>
        <Route path="/register" element={<UserRegisterpage/>}/>
        <Route path="/verify-otp" element={<VerifyOtp/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/admin-login" element={<AdminLogin/>}/>

        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/admin-home" element={ <ProtectedRoute element={<AdminDashboard/>} requiredRole="admin" />}/>


        <Route path="/host-register" element={<HostRegister/>}/>
        <Route path='/verify-host-otp' element={<VerifyHostOtp/>}/>
        <Route path="/host-login" element={<HostLogin/>}/>
        <Route path="/host-home" element={<HostHome/>}/>

        {/* Auth */}

        <Route path="/user-management" element={<ProtectedRoute element={<UserManagement/>} requiredRole="admin" />}/>
        <Route path="/host-management" element={<ProtectedRoute element={<HostManagement/>} requiredRole="admin" />}/>


        {/* <Route path="*" element={<NotFound />} /> */}


      </Routes>

    </Router>
  )
}

export default App