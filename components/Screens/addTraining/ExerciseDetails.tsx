import { BackgroundClassType, CleanExerciseType, ExerciseType, SerieRowType, SerieType } from "@/app/(app)/addTraining";
import { FC, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Vibration } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Timer from "../../Timer/Timer";
import SerieRow from "./SerieRow";
import { fetchLastTrainingWithExercise } from "@/firebase/fetchLastTrainingWithExercise";
import { useAppSelector } from "@/store/store";

type ExerciseRefType = {
    getExercise: () => ExerciseType,
}

type ExerciseDetailsProps = {
    onRemove: () => void;
    switchBgClass: (bgClass: BackgroundClassType) => void;
    exerciseName: string;
    ref: Ref<ExerciseRefType>;
}

const ExerciseDetails: FC<ExerciseDetailsProps> = (({ onRemove, switchBgClass, exerciseName, ref }) => {
    const user = useAppSelector(state => state.auth.user);
    const [lastResults, setLastResults] = useState<SerieType[] | null>(null);
    const [serieRows, setSerieRows] = useState<SerieRowType[]>([{ id: Date.now(), reps: '', weight: '', isDone: false }]);
    const [timerIsRunning, setTimerIsRunning] = useState(false);
    const serieRef = useRef<{ getSerie: (toFinish?: boolean) => SerieRowType }[]>([]);

    useEffect(() => {
        const getPreviousResults = async () => {
            const training = await fetchLastTrainingWithExercise(user?.userId!, exerciseName) as { date: string, exercises: CleanExerciseType[] } | null;

            if (training) {
                const exercise = training.exercises.find(exercise => exercise.exerciseName === exerciseName);

                if (exercise) {
                    const previousSeries = exercise.series.map((serie) => serie);

                    setLastResults(previousSeries);

                    setSerieRows((currentSerieRows) =>
                        currentSerieRows.map((row, index) => ({
                            ...row,
                            previousReps: previousSeries[index]?.reps || '',
                            previousWeight: previousSeries[index]?.weight || '',
                        }))
                    );
                }
            }
        }

        getPreviousResults();
    }, []);

    useImperativeHandle(ref, () => ({
        getExercise: () => getExercise()
    }));

    const getExercise = () => {
        const exercise = serieRef.current.map((serie) => serie.getSerie(true));

        return { exerciseName, series: exercise };
    };

    const handleAddSerieSelect = () => {
        const lastIndex = serieRows.length;
        const serieData = serieRef.current[lastIndex - 1]?.getSerie();
        const previousReps = serieData?.reps || '';
        const previousWeight = serieData?.weight || '';
        const lastSerieResult = lastResults && lastIndex >= 0 && lastIndex < lastResults.length
            ? lastResults[lastIndex]
            : null;
        if (previousReps && previousWeight || serieRows.length == 0) {
            setSerieRows(prevSerie => [...prevSerie, { id: Date.now(), reps: previousReps, weight: previousWeight, isDone: false, previousReps: lastSerieResult?.reps, previousWeight: lastSerieResult?.weight }]);
        } else {
            Vibration.vibrate();
            return;
        }
    };

    const handleRemoveSerieSelect = (id: number) => {
        setSerieRows(serieRows.filter(exercise => exercise.id !== id));
    };

    const handleRestStart = () => {
        switchBgClass("bg-azure");
        setTimerIsRunning(true);
    }

    const handleRestFinish = () => {
        setTimerIsRunning(false);
        switchBgClass("bg-secondaryGreen");
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
                    serie={serie}
                    index={index}
                    onRemoveSerieSelect={handleRemoveSerieSelect}
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