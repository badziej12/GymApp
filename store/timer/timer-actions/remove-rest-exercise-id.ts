import { BG_CLASS_KEY, REST_EXERCISE_ID, TIMER_REST_START_KEY } from "@/async-storage/keys";
import { AppDispach } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { timerActions } from "../timer-slice";
import { trainingActions } from "@/store/training/training-slice";

export const stopExeriseRestWithAsyncStorage = () => {
    return async (dispatch: AppDispach) => {
        try {
            await AsyncStorage.removeItem(REST_EXERCISE_ID);
            await AsyncStorage.removeItem(TIMER_REST_START_KEY);
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-secondaryGreen");
            dispatch(timerActions.setRestExerciseId(null));
            dispatch(trainingActions.setBgClass("bg-secondaryGreen"));
        } catch (error) {
            console.error("Failed to remove rest exercise ID from AsyncStorage", error);
        }
    }
}