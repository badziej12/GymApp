import { BG_CLASS_KEY, TIMER_REST_START_KEY } from "@/async-storage/keys";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { stopExeriseRestWithAsyncStorage } from "@/store/timer/timer-actions/remove-rest-exercise-id";
import { startExerciseRestWithAsyncStorage } from "@/store/timer/timer-actions/set-rest-exercise-id";
import { trainingActions } from "@/store/training/training-slice";
import { formatTime } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Vibration, View, Text } from "react-native";

type RestTimerProps = {
    duration: number;
    exerciseId: number;
    textProps?: any;
}

const RestTimer: FC<RestTimerProps> = ({ duration, exerciseId, textProps }) => {
    const currentRestExerciseId = useAppSelector(state => state.timer.restExerciseId);
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState(duration);
    const dispatch = useAppDispatch();

    const startTimer = useCallback(() => {
        dispatch(startExerciseRestWithAsyncStorage(exerciseId, duration));
    }, [dispatch, exerciseId, duration]);

    const resetTimer = useCallback(async () => {
        dispatch(stopExeriseRestWithAsyncStorage());
        Vibration.vibrate();
    }, [dispatch]);

    useEffect(() => {
        setTime(duration);
    }, [duration])

    useEffect(() => {
        const loadTimer = async () => {
            console.log(currentRestExerciseId);
            const storedStart = await AsyncStorage.getItem(TIMER_REST_START_KEY);
            if (storedStart) {
                const startTime = parseInt(storedStart, 10);
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = duration - elapsed;
                setTime(remaining);
            } else {
                startTimer();
            }
        };

        currentRestExerciseId === exerciseId && loadTimer();
    }, [exerciseId, startTimer, currentRestExerciseId]);

    useEffect(() => {
        if (currentRestExerciseId !== exerciseId) {
            setTime(duration);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
            return;
        }

        const run = async () => {
            const storedStart = await AsyncStorage.getItem(TIMER_REST_START_KEY);
            let startTime = storedStart ? parseInt(storedStart, 10) : null;
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-azure");
            dispatch(trainingActions.setBgClass("bg-azure"));

            if (!startTime) {
                startTime = Date.now();
                await AsyncStorage.setItem(TIMER_REST_START_KEY, startTime.toString());
            }

            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime!) / 1000);
                const remaining = duration - elapsed;

                setTime(remaining);

                if (remaining <= 0) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    resetTimer();
                }
            }, 1000);
        };

        run();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
        };
    }, [currentRestExerciseId, exerciseId, duration, resetTimer, dispatch]);

    return (
        <View>
            <Text {...textProps}>{formatTime(time)}</Text>
        </View>
    )
}

export default RestTimer;