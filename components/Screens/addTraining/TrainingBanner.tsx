import RestTimer from "@/components/Timer/RestTimer";
import Timer from "@/components/Timer/Timer";
import { useAppSelector } from "@/store/store";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

const TrainingBanner = () => {
    const timerIsRunning = useAppSelector(state => state.timer.isRunning);
    const restExerciseId = useAppSelector(state => state.timer.restExerciseId);
    const bgClass = useAppSelector(state => state.training.bgClass);
    const restDuration = useAppSelector(state => state.timer.currentRestTimeDuration);

    const onPress = () => {
        router.push("/addTraining");
    }

    let showRestTimer = false;

    if (restExerciseId && restDuration > 0) {
        showRestTimer = true;
    }

    return (
        <Pressable onPress={onPress} className={`${bgClass} h-24 w-screen p-4 justify-between items-center flex-row`}>
            <Text style={styles.title}>Trening</Text>
            {showRestTimer && <RestTimer exerciseId={restExerciseId!} duration={restDuration} textProps={{ style: [styles.title, { fontSize: 16 }] }} />}
            <Timer isRunning={timerIsRunning} textProps={{ style: [styles.title, { opacity: restExerciseId ? .5 : 1 }] }} />
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