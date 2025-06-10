import { useAppDispatch } from "@/store/store";
import { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Text, Vibration, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { timerActions } from "@/store/timer/timer-slice";
import { trainingActions } from "@/store/training/training-slice";
import { BG_CLASS_KEY, REST_IS_RUNNING_KEY, TIMER_IS_RUNNING_KEY, TIMER_REST_START_KEY, TIMER_START_KEY } from "@/async-storage/keys";

type TimerProps = {
    mode: "up" | "down";
    duration?: number; // tylko dla "down"
    isRunning: boolean;
    textProps?: any;
    ref?: Ref<TimerRef>;
};

export type TimerRef = {
    resetTimer: () => void;
}

const Timer: FC<TimerProps> = ({ mode, duration = 0, isRunning, textProps, ref }) => {
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState(mode === "down" ? duration : 0);
    const dispatch = useAppDispatch();

    const TIMER_KEY = mode === 'down' ? TIMER_REST_START_KEY : TIMER_START_KEY;

    const startTimer = async () => {
        const now = Date.now().toString();
        await AsyncStorage.setItem(TIMER_KEY, now);
        await AsyncStorage.setItem(TIMER_IS_RUNNING_KEY, 'true');
    };

    const resetTimer = async () => {
        await AsyncStorage.removeItem(TIMER_KEY);
        if (mode === 'down') {
            setTime(duration);
            await AsyncStorage.removeItem(REST_IS_RUNNING_KEY);
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-secondaryGreen")
            dispatch(timerActions.setIsRest(false));
            dispatch(trainingActions.setBgClass("bg-secondaryGreen"));
            Vibration.vibrate();
        }
    };

    useImperativeHandle(ref, () => ({
        resetTimer,
    }));

    useEffect(() => {
        const loadTimer = async () => {
            const storedStart = await AsyncStorage.getItem(TIMER_KEY);
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
            const storedStart = await AsyncStorage.getItem(TIMER_KEY);
            let startTime = storedStart ? parseInt(storedStart, 10) : null;

            if (!startTime) {
                startTime = Date.now();
                await AsyncStorage.setItem(TIMER_KEY, startTime.toString());
            }

            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime!) / 1000);

                setTime(elapsed);

                if (mode === "down") {
                    const remaining = duration - elapsed;
                    if (remaining <= 0) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        resetTimer();
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

    let displayTime = time;
    if (mode === "down") {
        displayTime = intervalRef.current ? Math.max(duration - time, 0) : time;
    }

    return (
        <View>
            <Text {...textProps}>{formatTime(displayTime)}</Text>
        </View>
    );
};

export default Timer;
