import { useEffect, useRef, useState } from "react";
import { Text, View, Pressable, TextProps } from "react-native";

type TimerProps = {
    mode: "up" | "down";
    duration?: number; // tylko dla "down"
    isRunning: boolean;
    onFinish?: () => void;
    textProps?: TextProps;
};

const Timer = ({ mode, duration = 0, isRunning, onFinish, textProps }: TimerProps) => {
    const [time, setTime] = useState(mode === "down" ? duration : 0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (mode === "up") {
                        return prevTime + 1;
                    } else {
                        if (prevTime <= 1) {
                            clearInterval(intervalRef.current!);
                            onFinish?.();
                            return duration;
                        }
                        return prevTime - 1;
                    }
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <View>
            <Text {...textProps}>{formatTime(time)}</Text>
        </View>
    );
};

export default Timer;
