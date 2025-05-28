import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signIn = async (email: string, password: string) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (e: any) {
        let msg = e.message;
        if (msg.includes('(auth/invalid-email')) msg = 'Invalid email'
        if (msg.includes('(auth/invalid-credential')) msg = 'Invalid credentials'
        return { success: false, msg: msg }
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true }
    } catch (e: any) {
        return { success: false, msg: e.message, error: e }
    }
}

export const signUp = async (email: string, password: string, username: string) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        // console.log('response.user : ', response?.user);
        await setDoc(doc(db, "users", response?.user?.uid), {
            username,
            userId: response?.user?.uid,
            groups: [],
        });
        return { success: true, data: response?.user };
    } catch (e: any) {
        let msg = e.message;
        if (msg.includes('(auth/invalid-email')) msg = 'Invalid email'
        if (msg.includes('(auth/email-already-in-use')) msg = 'This email is already in use'
        return { success: false, msg: msg }
    }
}