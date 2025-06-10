
import { fetchLastTrainings } from "@/firebase/fetch-last-trainings";
import { AppDispach } from "@/store/store";
import { trainingActions } from "../training-slice";
import { CleanExerciseType } from "@/app/(app)/addTraining";

export const getLastTrainings = (userId: string | undefined, limitNumber: number = 10) => {
    return async (dispatch: AppDispach) => {
        try {
            if (!userId) {
                dispatch(trainingActions.setLastTrainings([]));
            } else {
                const docs = await fetchLastTrainings(userId, limitNumber);

                const trainings = docs.map(doc => doc.data()) as { date: string, exercises: CleanExerciseType[] }[];

                dispatch(trainingActions.setLastTrainings(trainings));
            }
        } catch (error) {
            console.error("Error fetching training:", error);
            throw error;
        }
    }
}
