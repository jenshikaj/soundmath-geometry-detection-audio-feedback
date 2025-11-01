import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../firebaseAuth";
import { toast } from "react-toastify";
import { login, signup } from "../assets";
import styles from "../style";

// AuthPage component manages login and signup flows
const AuthPage = ({ isSignup }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Tracks form submission state
    const [error, setError] = useState(""); // Stores error messages

    useEffect(() => {
        localStorage.removeItem("redirectAfterLogin"); // Clears redirect on initial load
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
        password: "",
        confirmPassword: ""
    });

    // Handles form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles form submission for signup or login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isSignup) {
            // Validate password match for signup
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match!", { theme: "colored", toastClassName: "text-left" });
                setLoading(false);
                return;
            }

            const result = await signupUser(
                formData.name,
                formData.email,
                formData.age,
                formData.gender,
                formData.password
            );

            if (result.success) {
                toast.success("Signup successful! Please log in.", { theme: "colored", toastClassName: "text-left" });
                navigate("/login");
            } else {
                toast.error(result.error, { theme: "colored", toastClassName: "text-left" });
            }
        } else {
            const result = await loginUser(formData.email, formData.password);

            if (result.success) {
                toast.success("Login successful!", { theme: "colored", toastClassName: "text-left" });

                // Redirect after login if a path exists
                const redirectPath = localStorage.getItem("redirectAfterLogin");

                if (redirectPath) {
                    localStorage.removeItem("redirectAfterLogin"); // Ensure it's cleared
                    navigate(redirectPath);
                } else {
                    navigate("/", { replace: true }); // Ensure clean navigation to home
                }
            } else {
                toast.error(result.error, { theme: "colored", toastClassName: "text-left" });
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen items-center justify-center font-poppins">
            {isSignup && (
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <img src={login} alt="Signup Visual" className="w-[90%] h-[600px] object-contain" />
                </div>
            )}

            {/* Form section */}
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
                    <h2 className={`${styles.heading3} text-center mb-4 text-black`}>
                        {isSignup ? "Create an Account" : "Welcome Back"}
                    </h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignup ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-black mb-1">Name</label>
                                    <input type="text" name="name" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />
                                </div>
                                <div>
                                    <label className="block text-black mb-1">Email</label>
                                    <input type="email" name="email" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />
                                </div>
                                <div>
                                    <label className="block text-black mb-1">Age</label>
                                    <input type="number" name="age" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />
                                </div>
                                <div>
                                    <label className="block text-black mb-1">Gender</label>
                                    <select name="gender" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-black mb-1">Email</label>
                                <input type="email" name="email" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />
                            </div>
                        )}

                        <label className="block text-black mb-1">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />

                        {isSignup && (
                            <>
                                <label className="block text-black mb-1">Confirm Password</label>
                                <input type="password" name="confirmPassword" onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 text-black" required />
                            </>
                        )}

                        <button type="submit" disabled={loading} className="w-full p-2 text-white rounded" style={{ backgroundColor: '#FF5757' }}>
                            {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
                        </button>
                    </form>

                    <p className="text-black text-center mt-4">
                        {isSignup ? "Already have an account? " : "Don't have an account? "}
                        <Link to={isSignup ? "/login" : "/signup"} className="text-[#FF5757] hover:underline">
                            {isSignup ? "Log In" : "Sign Up"}
                        </Link>
                    </p>
                </div>
            </div>

            {!isSignup && (
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <img src={signup} alt="Login Visual" className="w-[90%] h-[600px] object-contain" />
                </div>
            )}
        </div>
    );
};

export default AuthPage;