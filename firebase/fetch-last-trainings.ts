
import { collection, query, orderBy, limit, getDocs, doc } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig";

export const fetchLastTrainings = async (userId: string, limitNumber: number = 10) => {
    const userRef = doc(usersRef, userId);
    const userTrainingsRef = collection(userRef, "trainings");

    const q = query(
        userTrainingsRef,
        orderBy("date", "desc"),
        limit(limitNumber)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs;
};