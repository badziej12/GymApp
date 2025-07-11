import { Stack } from "expo-router";

// Import your global CSS file
import "../../global.css"
import { GroupsProvider } from "@/context/groupsContext";
import { HomeHeader } from "@/components/navigation/HomeHeader";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trainingActions } from "@/store/training/training-slice";
import { timerActions } from "@/store/timer/timer-slice";
import { BackgroundClassType } from "@/types";
import { BG_CLASS_KEY, REST_DURATION_KEY, REST_EXERCISE_ID, TIMER_IS_RUNNING_KEY, TRAINING_EXERCISES_KEY, TRAINING_IN_PROGRESS_KEY } from "@/async-storage/keys";
import { exerciseActions } from "@/store/exercise/exercise-slice";

export default function _layout() {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadTrainingAsyncStorage = async () => {
      const trainingInProgress = await AsyncStorage.getItem(TRAINING_IN_PROGRESS_KEY);
      if (trainingInProgress === "true") {
        dispatch(trainingActions.setInProgress(true));
        const bgClass = await AsyncStorage.getItem(BG_CLASS_KEY) as BackgroundClassType;
        const timerIsRunning = await AsyncStorage.getItem(TIMER_IS_RUNNING_KEY);
        const restExerciseId = await AsyncStorage.getItem(REST_EXERCISE_ID);
        const trainingExercises = await AsyncStorage.getItem(TRAINING_EXERCISES_KEY);
        const restDuration = await AsyncStorage.getItem(REST_DURATION_KEY);
        restDuration && dispatch(timerActions.setCurrentRestTimeDuration(parseInt(restDuration)));
        bgClass && dispatch(trainingActions.setBgClass(bgClass));
        timerIsRunning === "true" && dispatch(timerActions.setIsRunning(true));
        restExerciseId && dispatch(timerActions.setRestExerciseId(parseInt(restExerciseId)));
        trainingExercises && dispatch(exerciseActions.replaceExercises(JSON.parse(trainingExercises)));
      }
    }

    loadTrainingAsyncStorage();
  }, [dispatch])

  return (
    <GroupsProvider>
      <Stack
        screenOptions={{
          header: props => <HomeHeader userName={user?.username} />,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="addTraining" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </GroupsProvider>
  )
}