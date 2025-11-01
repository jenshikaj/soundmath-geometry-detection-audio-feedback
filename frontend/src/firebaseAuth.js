import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Function to handle user signup
export const signupUser = async (name, email, age, gender, password) => {
    try {
        // Create user with email and password in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            email,
            age,
            gender,
            createdAt: new Date(),
        });

        return { success: true, user };
    } catch (error) {
        // Return error message if signup fails
        return { success: false, error: error.message };
    }
};

// Function to handle user login
export const loginUser = async (email, password) => {
    try {
        // Authenticate user with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        // Store session ID in localStorage for persistent login
        localStorage.setItem("sessionId", user.uid);

        return { success: true, user: userCredential.user };
    } catch (error) {
        // Return error message if login fails
        return { success: false, error: error.message };
    }
};

// Function to handle user logout
export const logoutUser = async () => {
    try {
        await auth.signOut(); // Sign out the user
        localStorage.removeItem("sessionId"); // Clear session ID from localStorage
        return { success: true };
    } catch (error) {
        // Return error message if logout fails
        return { success: false, error: error.message };
    }
};

// Function to delete a user (authenticated user)
export const deleteUserAccount = async (user) => {
    try {
        await deleteUser(user); // Delete the user from Firebase Authentication
        return { success: true };
    } catch (error) {
        // Return error message if deletion fails
        return { success: false, error: error.message };
    }
};