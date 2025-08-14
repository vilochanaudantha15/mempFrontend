import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/NavBar";
import CalendarScheduler from "./components/calender/Calender";
import ProfileCard from "./components/profile/Profile";
import ShiftProductionSummary from "./components/currentStock/productionSummary/ProductionSummary";
import AssemblyLineSummary from "./components/AssemblyLine/AssemblySummary";
import ProductionShiftReport from "./components/currentStock/productionSummary/ProductionSummary";
import DefectiveCrushed from "./components/DefectiveCrushing/DefectiveCrushing";
import AssemblySummary from "./components/AssemblyLine/AssemblySummary";
import DeliveryNote from "./components/DeliveryNote/DeliveryNote";
import DispatchSummary from "./components/DispatchSummary/DispatchSummary";

// Lazy-loaded components
const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/Register/Register"));
const Home = lazy(() => import("./pages/Dashboard/Dashboard"));
const LandingPage = lazy(() => import("./pages/Landing/Landing"));

const ProtectedRoute = ({ element }) => {
  const authToken = sessionStorage.getItem("authToken");
  return authToken ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      {user && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/productionsummary"
            element={<ProtectedRoute element={<ProductionShiftReport />} />}
          />
          <Route
            path="/assemblysummary"
            element={<ProtectedRoute element={<AssemblySummary />} />}
          />
          <Route
            path="/defective"
            element={<ProtectedRoute element={<DefectiveCrushed />} />}
          />
          <Route
            path="/calendar"
            element={<ProtectedRoute element={<CalendarScheduler />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfileCard />} />}
          />
          <Route
            path="/delivernote"
            element={<ProtectedRoute element={<DeliveryNote />} />}
          />
          <Route
            path="/dispatchsummary"
            element={<ProtectedRoute element={<DispatchSummary />} />}
          />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        theme="colored"
      />
    </Router>
  );
};

export default App;