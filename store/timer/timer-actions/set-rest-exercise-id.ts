import { BG_CLASS_KEY, REST_EXERCISE_ID, TIMER_REST_START_KEY } from "@/async-storage/keys"
import { AppDispach } from "@/store/store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { timerActions } from "../timer-slice"
import { trainingActions } from "@/store/training/training-slice"

export const startExerciseRestWithAsyncStorage = (exerciseId: number) => {
    return async (dispatch: AppDispach) => {
        try {
            const now = Date.now().toString();
            await AsyncStorage.setItem(TIMER_REST_START_KEY, now);
            await AsyncStorage.setItem(REST_EXERCISE_ID, exerciseId.toString());
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-azure");
            dispatch(timerActions.setRestExerciseId(exerciseId));
            dispatch(trainingActions.setBgClass("bg-azure"));
        } catch (error) {
            console.error("Failed to set rest exercise ID in AsyncStorage", error);
        }
    }
}