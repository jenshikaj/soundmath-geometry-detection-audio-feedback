//Serves as the main entry point for the application, setting up routing, layout, and global components

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import styles from "./style";
import { About, AboutSectionTwo, CardDeal, CTA, Footer, Navbar, Stats, Testimonials, Hero, StartDetection, AuthPage, Profile} from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout component to define the common structure for the app
const Layout = () => {
  const location = useLocation();// Access the current path for conditional rendering or styling

  return (
    <div className="bg-primary w-full overflow-hidden">
      {/* Navbar Section */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar currentPath={location.pathname} />
        </div>
      </div>

      {/* Routes Section */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Main Area Section */}
              <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                  <Hero />
                </div>
              </div>

              {/* Content Section */}
              <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Stats />
                  <About />
                  <AboutSectionTwo />
                  <CardDeal />
                  <Testimonials />
                  <CTA />
                  <Footer />
                </div>
              </div>
            </>
          }
        />
        {/* Auth Routes */}
        <Route path="/login" element={<AuthPage isSignup={false} />} />
        <Route path="/signup" element={<AuthPage isSignup={true} />} />

        {/* Functional Routes */}
        <Route path="/startdetection" element={<StartDetection />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

// Main App component to wrap the application with Router and global configurations
const App = () => (
  <Router>
    {/* ToastContainer for global notifications */}
    <ToastContainer />
    <Layout />
  </Router>
);

export default App;
