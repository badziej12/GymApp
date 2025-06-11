import { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Vibration } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SerieRow from "./SerieRow";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { exerciseActions } from "@/store/exercise/exercise-slice";
import { CleanExerciseType, SerieRowType, SerieType } from "@/types";
import RestTimer from "@/components/Timer/RestTimer";
import { stopExeriseRestWithAsyncStorage } from "@/store/timer/timer-actions/remove-rest-exercise-id";
import { startExerciseRestWithAsyncStorage } from "@/store/timer/timer-actions/set-rest-exercise-id";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig";
import { fetchUserSettings } from "@/firebase/fetch-user-settings";

type ExerciseDetailsProps = {
    onRemove: () => void;
    exerciseId: number;
    exerciseName: string;
}

const emptyArray: SerieRowType[] = [];

const getLastTrainingWithExercise = (trainings: { date: string, exercises: CleanExerciseType[] }[], exerciseName: string) => {
    for (const training of trainings) {
        const exercises = training.exercises || [];

        const hasExercise = exercises.some((exercise: any) => exercise.exerciseName === exerciseName);

        if (hasExercise) {
            return training;
        }
    }

    return null
}

const ExerciseDetails: FC<ExerciseDetailsProps> = (({ onRemove, exerciseId, exerciseName }) => {
    const serieRows = useAppSelector(state => state.exercise.exercises[exerciseId].series) || emptyArray;
    const lastTrainings = useAppSelector(state => state.training.lastTrainings);
    const currentRestExerciseId = useAppSelector(state => state.timer.restExerciseId);
    const user = useAppSelector(state => state.auth.user);
    const [lastResults, setLastResults] = useState<SerieType[] | null>(null);
    const [restDuration, setRestDuration] = useState<number>(30);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const setExerciseRestTime = async () => {
            if (user) {
                const doc = await fetchUserSettings(user.userId, "restTime");
                if (doc) {
                    const restTimeForExercises = doc.data().exerciseNames;
                    const restTime = restTimeForExercises[exerciseName];
                    console.log(restTime);
                    if (restTime) setRestDuration(restTime);
                }
            }
        }

        setExerciseRestTime();
    }, [user]);

    useEffect(() => {
        const getPreviousResults = () => {
            const training = getLastTrainingWithExercise(lastTrainings, exerciseName) as { date: string, exercises: CleanExerciseType[] } | null;

            if (training) {
                const exercise = training.exercises.find(exercise => exercise.exerciseName === exerciseName);

                if (exercise) {
                    const previousSeries = exercise.series.map((serie) => serie);

                    return previousSeries;
                }
            }

            return [];
        }
        const previousResults = lastTrainings.length > 0 ? getPreviousResults() : [];

        previousResults.length > 0 && setLastResults(previousResults);

        const initialSerieRows = serieRows.length > 0
            ? serieRows.map((serie, index) => ({
                ...serie,
                previousReps: previousResults[index]?.reps || '',
                previousWeight: previousResults[index]?.weight || '',
            }))
            : [{
                id: Date.now(),
                reps: '',
                weight: '',
                isDone: false,
                previousReps: previousResults[0]?.reps || '',
                previousWeight: previousResults[0]?.weight || '',
                weightError: false,
                repsError: false,
                isDoneError: false,
            }];

        dispatch(exerciseActions.initSerieRows({ exerciseId, serieRows: initialSerieRows }));
    }, [lastTrainings]);

    const handleAddSerieSelect = async () => {
        const lastIndex = serieRows.length;
        const serieData = serieRows[lastIndex - 1];
        const previousReps = serieData.reps || '';
        const previousWeight = serieData.weight || '';
        const lastSerieResult = lastResults && lastIndex >= 0 && lastIndex < lastResults.length
            ? lastResults[lastIndex]
            : null;
        if (previousReps && previousWeight || serieRows.length == 0) {
            dispatch(exerciseActions.addSerieRow({
                exerciseId,
                newSerie: {
                    id: Date.now(),
                    reps: previousReps,
                    weight: previousWeight,
                    isDone: false,
                    previousReps: lastSerieResult?.reps || '',
                    previousWeight: lastSerieResult?.weight || '',
                    weightError: false,
                    repsError: false,
                    isDoneError: false,
                }
            }))
        } else {
            dispatch(exerciseActions.updateSerieRow({
                exerciseId,
                index: lastIndex - 1,
                serie: {
                    ...serieData,
                    repsError: true,
                    weightError: true,
                }
            }))
            Vibration.vibrate();
            return;
        }
    };

    const handleRemoveSerieSelect = (serieId: number) => {
        dispatch(exerciseActions.removeSerieRow({ exerciseId, serieId }));
    };

    const handleRestStart = async () => {
        if (currentRestExerciseId === exerciseId) {
            dispatch(stopExeriseRestWithAsyncStorage());
        } else {
            dispatch(startExerciseRestWithAsyncStorage(exerciseId, restDuration));
        }
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
                    key={serie.id}
                    exerciseId={exerciseId}
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
                <RestTimer exerciseId={exerciseId} textProps={{ style: styles.restButtonCopy }} duration={restDuration} />
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