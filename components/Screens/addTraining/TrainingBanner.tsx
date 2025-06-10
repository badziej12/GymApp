import Timer from "@/components/Timer/Timer";
import { useAppSelector } from "@/store/store";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

const TrainingBanner = () => {
    const timerIsRunning = useAppSelector(state => state.timer.isRunning);
    const restIsRunning = useAppSelector(state => state.timer.isRest);
    const bgClass = useAppSelector(state => state.training.bgClass);

    const onPress = () => {
        router.push("/addTraining");
    }

    return (
        <Pressable onPress={onPress} className={`${bgClass} h-24 w-screen p-4 justify-between items-center flex-row`}>
            <Text style={styles.title}>Trening</Text>
            {restIsRunning && <Timer mode="down" isRunning={restIsRunning} duration={10} textProps={{ style: [styles.title, { fontSize: 16 }] }} />}
            <Timer mode="up" isRunning={timerIsRunning} textProps={{ style: [styles.title, { opacity: restIsRunning ? .5 : 1 }] }} />
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