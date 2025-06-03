import { collection, query, where, orderBy, limit, getDocs, doc } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig";

export const fetchLastTrainingWithExercise = async (userId: string, exerciseName: string) => {
    try {
        const userRef = doc(usersRef, userId);
        const userTrainingsRef = collection(userRef, "trainings");

        const q = query(
            userTrainingsRef,
            orderBy("date", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const exercises = data.exercises || [];

            const hasExercise = exercises.some((exercise: any) => exercise.exerciseName === exerciseName);

            if (hasExercise) {
                return data;
            }
        }

        return null;
    } catch (error) {
        console.error("Error fetching training:", error);
        throw error;
    }
};