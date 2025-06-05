import Timer, { TimerRef } from "@/components/Timer/Timer";
import { useAppSelector } from "@/store/store";
import { router } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TrainingBanner = () => {
    const trainingInProgress = useAppSelector(state => state.training.inProgress);
    const timerRef = useRef<TimerRef>(null);

    const onPress = () => {
        router.push("/addTraining");
    }

    return (
        <Pressable onPress={onPress} className={"bg-secondaryGreen h-24 w-screen p-4 justify-between items-center flex-row"}>
            <Text style={styles.title}>Trening</Text>
            <Timer ref={timerRef} mode="up" isRunning={trainingInProgress} textProps={{ style: styles.title }} />
        </Pressable>
    )
}

export default TrainingBanner;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: 'white',
        fontFamily: 'Rubik_700Bold_Italic',
    },
})