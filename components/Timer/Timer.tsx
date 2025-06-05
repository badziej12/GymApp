import { useAppDispatch, useAppSelector } from "@/store/store";
import { trainingActions } from "@/store/training/training-slice";
import { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TRAINING_TIMER_START_KEY = "training_start_time";

type TimerProps = {
    mode: "up" | "down";
    duration?: number; // tylko dla "down"
    isRunning: boolean;
    onFinish?: () => void;
    textProps?: any;
    ref: Ref<TimerRef>;
};

export type TimerRef = {
    resetTimer: () => void;
}

const Timer: FC<TimerProps> = ({ mode, duration = 0, isRunning, onFinish, textProps, ref }) => {
    const intervalRef = useRef<number | null>(null);
    const dispatch = useAppDispatch();
    const [time, setTime] = useState(0);

    const startTimer = async () => {
        const now = Date.now().toString();
        await AsyncStorage.setItem(TRAINING_TIMER_START_KEY, now);
    };

    const resetTimer = async () => {
        intervalRef.current && clearInterval(intervalRef.current);
        await AsyncStorage.removeItem(TRAINING_TIMER_START_KEY);
        dispatch(trainingActions.setTrainingTime(0));
    };

    useImperativeHandle(ref, () => ({
        resetTimer,
    }));

    useEffect(() => {
        const loadTimer = async () => {
            const storedStart = await AsyncStorage.getItem(TRAINING_TIMER_START_KEY);
            if (storedStart) {
                const startTime = parseInt(storedStart, 10);
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTime(elapsed);
            } else {
                if (isRunning) await startTimer();
            }
        };

        loadTimer();
    }, []);

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const run = async () => {
            const storedStart = await AsyncStorage.getItem(TRAINING_TIMER_START_KEY);
            let startTime = storedStart ? parseInt(storedStart, 10) : null;

            if (!startTime) {
                startTime = Date.now();
                await AsyncStorage.setItem(TRAINING_TIMER_START_KEY, startTime.toString());
            }

            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime!) / 1000);

                setTime(elapsed);
                dispatch(trainingActions.setTrainingTime(elapsed)); // możesz mieć własną akcję

                if (mode === "down") {
                    const remaining = duration - elapsed;
                    if (remaining <= 0) {
                        clearInterval(intervalRef.current!);
                        resetTimer();
                        onFinish?.();
                    }
                }
            }, 1000);
        };

        run();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const displayTime = mode === "up" ? time : Math.max(duration - time, 0);

    return (
        <View>
            <Text {...textProps}>{formatTime(displayTime)}</Text>
        </View>
    );
};

export default Timer;
