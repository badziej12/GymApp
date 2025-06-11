import { usersRef } from "@/firebaseConfig";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

export const fetchUserSettings = async (userId: string, settingName: string) => {
    const userRef = doc(usersRef, userId);
    const settingsRef = collection(userRef, "settings");

    const q = query(settingsRef, where("settingName", "==", settingName));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0];
}