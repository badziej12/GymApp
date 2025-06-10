import AsyncStorage from "@react-native-async-storage/async-storage"
import { BG_CLASS_KEY, REST_IS_RUNNING_KEY, TIMER_IS_RUNNING_KEY, TIMER_REST_START_KEY, TIMER_START_KEY, TRAINING_EXERCISES_KEY, TRAINING_IN_PROGRESS_KEY } from "./keys"

export const clearAsyncStorageFromTraining = async () => {
    try {
        await AsyncStorage.removeItem(TRAINING_IN_PROGRESS_KEY);
        await AsyncStorage.removeItem(TRAINING_EXERCISES_KEY);
        await AsyncStorage.removeItem(TIMER_START_KEY);
        await AsyncStorage.removeItem(TIMER_IS_RUNNING_KEY);
        await AsyncStorage.removeItem(REST_IS_RUNNING_KEY);
        await AsyncStorage.removeItem(TIMER_REST_START_KEY);
        await AsyncStorage.removeItem(BG_CLASS_KEY);
    } catch (error) {
        console.error("Error clearing async storage:", error);
    }
}