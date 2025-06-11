import { useAppDispatch } from "@/store/store";
import { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Text, Vibration, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { timerActions } from "@/store/timer/timer-slice";
import { trainingActions } from "@/store/training/training-slice";
import { TIMER_IS_RUNNING_KEY, TIMER_START_KEY } from "@/async-storage/keys";
import { formatTime } from "@/utils";

type TimerProps = {
    isRunning: boolean;
    textProps?: any;
    ref?: Ref<TimerRef>;
};

export type TimerRef = {
    resetTimer: () => void;
}

const Timer: FC<TimerProps> = ({ isRunning, textProps, ref }) => {
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState(0);

    const startTimer = async () => {
        const now = Date.now().toString();
        await AsyncStorage.setItem(TIMER_START_KEY, now);
        await AsyncStorage.setItem(TIMER_IS_RUNNING_KEY, 'true');
    };

    const resetTimer = async () => {
        await AsyncStorage.removeItem(TIMER_START_KEY);
    };

    useImperativeHandle(ref, () => ({
        resetTimer,
    }));

    useEffect(() => {
        const loadTimer = async () => {
            const storedStart = await AsyncStorage.getItem(TIMER_START_KEY);
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
            const storedStart = await AsyncStorage.getItem(TIMER_START_KEY);
            let startTime = storedStart ? parseInt(storedStart, 10) : null;

            if (!startTime) {
                startTime = Date.now();
                await AsyncStorage.setItem(TIMER_START_KEY, startTime.toString());
            }

            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime!) / 1000);

                setTime(elapsed);
            }, 1000);
        };

        run();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    return (
        <View>
            <Text {...textProps}>{formatTime(time)}</Text>
        </View>
    );
};

export default Timer;
