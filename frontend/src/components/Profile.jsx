
//The Profile component handles the display and management of user profile information. It allows users to view their details, update their profile, log out, or delete their account.

import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { logoutUser, deleteUserAccount } from "../firebaseAuth";
import { useNavigate } from "react-router-dom";
import { FiMail, FiUser, FiCalendar, FiUserCheck } from "react-icons/fi";
import { FaTrashAlt, FaSignOutAlt, FaUserEdit, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {

    // State Management
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newGender, setNewGender] = useState("");
    const [newAge, setNewAge] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Push a new state to block back navigation
        window.history.pushState(null, "", window.location.href);

        const handlePopState = (e) => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handlePopState);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // Effect Hook for Fetching User Data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Logout Functionality
    const handleLogout = async () => {
        await logoutUser(auth);
        toast.success("Logout successfully!", {
            theme: "colored",
        });
        navigate("/", { replace: true });
    };

    // Delete Account Functionality with Confirmation Modal
    const handleDeleteAccount = () => {
        toast(
            ({ closeToast }) => (
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-white font-semibold">
                            Are you sure you want to delete your account?
                        </p>
                        <div className="flex justify-end gap-3 mt-3">
                            <button
                                className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
                                onClick={closeToast}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition"
                                onClick={async () => {
                                    closeToast(); // Close modal immediately

                                    try {
                                        sessionStorage.clear();
                                        localStorage.clear();

                                        await deleteDoc(doc(db, "users", user.uid));
                                        await deleteUserAccount(user);

                                        toast.success("Account deleted successfully!", {
                                            theme: "colored",
                                        });
                                        navigate("/", { replace: true });
                                    } catch (error) {
                                        console.error("Error deleting account:", error);
                                        toast.error("Failed to delete account.", {
                                            theme: "dark",
                                        });
                                    }
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                theme: "dark",
                className: "bg-gray-900 text-white rounded-lg p-4 shadow-xl border border-gray-700",
            }
        );
    };

    // Profile Update Functionality
    const handleUpdateProfile = async () => {
        if (!["Male", "Female"].includes(newGender) && newGender !== "") {
            toast.error("Gender must be either Male or Female.");
            return;
        }

        const updatedData = {
            name: newName || userData?.name,
            gender: newGender || userData?.gender,
            age: newAge || userData?.age,
            createdAt: userData?.createdAt || new Date(), // Preserve existing createdAt
        };

        try {
            await updateDoc(doc(db, "users", user.uid), updatedData);
            setUserData((prev) => ({
                ...prev,
                ...updatedData,
            }));

            setIsEditing(false); // Close modal immediately
            toast.success("Profile updated successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    if (loading) return <p className="text-center text-white">Loading...</p>;

    // Profile UI
    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white text-center border border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h2 className="text-2xl font-semibold mt-3">{userData?.name || "User"}</h2>
                    <p className="text-gray-300 text-sm">
                        Member since{" "}
                        {userData?.createdAt
                            ? new Date(userData.createdAt.toDate()).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>

                <div className="space-y-4 text-left">
                    <p className="flex items-center text-lg">
                        <FiUser className="text-green-400 mr-2" /> {userData?.name || "N/A"}
                    </p>
                    <p className="flex items-center text-lg">
                        <FiMail className="text-blue-400 mr-2" /> {user.email}
                    </p>
                    <p className="flex items-center text-lg">
                        <FiUserCheck className="text-yellow-400 mr-2" /> {userData?.gender || "N/A"}
                    </p>
                    <p className="flex items-center text-lg">
                        <FiCalendar className="text-purple-400 mr-2" />{" "}
                        {userData?.age ? `${userData.age} years old` : "N/A"}
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center p-3 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        <FaUserEdit className="mr-2" /> Update Profile
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-center p-3 bg-red-600 rounded-xl font-semibold hover:bg-red-700 transition duration-300"
                    >
                        <FaTrashAlt className="mr-2" /> Delete Account
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-3 bg-gray-600 rounded-xl font-semibold hover:bg-gray-700 transition duration-300"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Modal for editing the profile */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-10">
                    <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-xl border border-gray-700 text-white">
                        <h3 className="text-xl mb-4 font-semibold">Edit Profile</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white"
                                value={newName || userData?.name}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <select
                                className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white"
                                value={newGender || userData?.gender}
                                onChange={(e) => setNewGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Age"
                                className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white"
                                value={newAge || userData?.age}
                                onChange={(e) => setNewAge(e.target.value)}
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-200">Cancel</button>
                            <button onClick={handleUpdateProfile} className="bg-blue-500 text-white p-2 rounded-md">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
