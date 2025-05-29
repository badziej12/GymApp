import { FullExerciseRefType, SeriesType } from "@/app/(app)/addTraining";
import { FontAwesome } from "@expo/vector-icons";
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Vibration } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timer from "./Timer/Timer";
import SwipeableItem, { OpenDirection } from 'react-native-swipeable-item';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import SerieRow, { SerieRowRefType } from "./addTraining/SerieRow";


type ExerciseDetailsProps = {
    onRemove: () => void;
    exerciseName: string;
}

type SerieRowType = {
    reps: string;
    weight: string;
    isDone: boolean;
}

type RefType = {
    getExercise: () => FullExerciseRefType | null,
}

const ExerciseDetails = forwardRef<RefType, ExerciseDetailsProps>(({ onRemove, exerciseName }, ref) => {
    const [serieRows, setSerieRows] = useState([{ id: Date.now(), reps: '', weight: '' }]);
    const [timerIsRunning, setTimerIsRunning] = useState(false);
    const serieRef = useRef<{ getSerie: () => SerieRowType }[]>([]);

    const fullExerciseRef = useRef<FullExerciseRefType | null>(null);
    const repRef = useRef<string[]>([]);
    const weightRef = useRef<string[]>([]);

    useImperativeHandle(ref, () => ({
        getExercise: () => getExercise()
    }));

    const getExercise = () => {
        const reps = repRef.current;
        const weights = weightRef.current;

        const series: SeriesType[] = [];

        for (let i = 0; i < reps.length; i++) {
            if (weights[i] && reps[i]) {
                series.push({ reps: reps[i], weight: weights[i] });
            }
        }

        if (series.length > 0) {
            fullExerciseRef.current = {
                exerciseName: exerciseName,
                series: series
            };
        }

        return fullExerciseRef.current;
    };

    const handleAddSerieSelect = () => {
        const serieData = serieRef.current.at(-1)?.getSerie();
        const previousReps = serieData?.reps || '';
        const previousWeight = serieData?.weight || '';
        if (previousReps && previousWeight || serieRows.length == 0) {
            setSerieRows(prevSerie => [...prevSerie, { id: Date.now(), reps: previousReps, weight: previousWeight }]);
        } else {
            Vibration.vibrate();
            return;
        }
    };

    const handleRemoveSerieSelect = (id: number) => {
        setSerieRows(serieRows.filter(exercise => exercise.id !== id));
    };

    const handleRestStart = () => {
        setTimerIsRunning(true);
    }

    const handleRestFinish = () => {
        setTimerIsRunning(false);
        Vibration.vibrate();
    }

    return (
        <View style={{ borderWidth: 1 }} className="flex-col p-4 border-background-200 mb-4">
            <View className="mb-4 flex-row justify-between">
                <Text style={styles.trainingName} className="text-sunny uppercase">{exerciseName}</Text>
                <Pressable onPress={onRemove}><Text style={styles.trainingName} className="text-white">?</Text></Pressable>
            </View>
            <View className="flex-row mb-2 justify-between">
                <View className="w-1/12">
                    <Text style={styles.itemCopy}>Set</Text>
                </View>
                <View className="w-4/12 px-2">
                    <Text style={styles.itemCopy}>Previous</Text>
                </View>
                <View className="w-2/12">
                    <Text style={styles.itemCopy}>Kg</Text>
                </View>
                <View className="w-2/12">
                    <Text style={styles.itemCopy}>Reps</Text>
                </View>
                <View className="w-1/12">
                    <Text className="text-center" style={styles.itemCopy}>?</Text>
                </View>
            </View>
            {serieRows.map((serie, index) => (
                <SerieRow
                    ref={el => {
                        if (el) {
                            serieRef.current[index] = el;
                        }
                    }}
                    key={serie.id}
                    id={serie.id}
                    onRemoveSerieSelect={handleRemoveSerieSelect}
                    initialReps={serie.reps}
                    initialWeight={serie.weight}
                />
            ))}
            <Pressable onPress={handleAddSerieSelect} className="flex-row px-4 py-2 mb-4">
                <View className="flex-grow" style={styles.buttonSeriesLeftLine} />
                <Text className="mx-4" style={styles.buttoSeriesText}>Add set</Text>
                <View className="flex-grow" style={styles.buttonSeriesRightLine} />
            </Pressable>
            <Pressable onPress={handleRestStart} style={styles.restButton} className="flex-row justify-between px-2 py-1">
                <Text style={styles.restButtonCopy}>Rest</Text>
                <Timer mode="down" isRunning={timerIsRunning} textProps={{ style: styles.restButtonCopy }} duration={10} onFinish={handleRestFinish} />
            </Pressable>
        </View>
    )
});

export default ExerciseDetails;

const styles = StyleSheet.create({
    trainingName: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 12,
    },
    itemCopy: {
        color: "white",
        fontFamily: "Roboto_700Bold",
        fontSize: 12,
    },
    buttonText: {
        fontSize: hp(1.8),
        color: "white",
        fontWeight: "medium",
    },
    buttoSeriesText: {
        position: 'relative',
        fontSize: 14,
        color: "white",
        textTransform: "uppercase",
        fontFamily: "Montserrat_700Bold_Italic",
        top: 7,
    },
    buttonSeriesLeftLine: {
        borderColor: "white",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
    },
    buttonSeriesRightLine: {
        borderColor: "white",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    restButton: {
        borderWidth: 1,
        borderColor: "#E3B600",
        backgroundColor: "#FFD500",
    },
    restButtonCopy: {
        fontSize: 11,
        fontFamily: "Montserrat_700Bold_Italic",
    },
    inputBox: {
        backgroundColor: "#00000080",
        borderColor: "#000000CC",
        borderWidth: 1,
        color: "white",
        fontSize: 12,
        width: '100%',
        textAlign: 'center',
        fontFamily: "Roboto_400Regular",
        paddingVertical: 4,
    },
    previousReps: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: 'white',
        paddingVertical: 4,
    },
});