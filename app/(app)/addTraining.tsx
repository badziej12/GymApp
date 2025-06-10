import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, Vibration, Modal } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from "expo-router";
import { ButtonComponent } from "@/components/Buttons/ButtonComponent";
import ExerciseModal from "@/components/Screens/addTraining/ExerciseModal";
import ExerciseDetails from "@/components/Screens/addTraining/ExerciseDetails";
import Timer, { TimerRef } from "@/components/Timer/Timer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateUserTraining } from "@/firebase/updateUserTraining";
import { getLastTrainings } from "@/store/training/training-actions/get-last-trainings";
import { exerciseActions } from "@/store/exercise/exercise-slice";
import { trainingActions } from "@/store/training/training-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { timerActions } from "@/store/timer/timer-slice";
import { ExerciseType } from "@/types";
import { BG_CLASS_KEY, TIMER_IS_RUNNING_KEY, TRAINING_EXERCISES_KEY, TRAINING_IN_PROGRESS_KEY } from "@/async-storage/keys";
import { clearAsyncStorageFromTraining } from "@/async-storage/utils";

const dayNames = ["Sunday", "Monday", "Tuesday", "Thursday", "Wensday", "Friday", "Saturday"];

export default function AddTraining() {
    const selectedDateString = useAppSelector(state => state.date.selectedDate);
    const user = useAppSelector(state => state.auth.user);
    const exerciseSelects = useAppSelector(state => state.exercise.exercises);
    const bgClass = useAppSelector(state => state.training.bgClass);
    const timerIsRunning = useAppSelector(state => state.timer.isRunning);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const timerRef = useRef<TimerRef>(null);
    const dispatch = useAppDispatch();

    const selectedDate = new Date(selectedDateString);

    const dayOfTheMonth = selectedDate.getDate();
    const monthNumber = selectedDate.getMonth();
    const yearNumber = selectedDate.getFullYear();
    const displayedDate = `${dayOfTheMonth}.${monthNumber}.${yearNumber} - ${dayNames[selectedDate.getDay()]}`;

    useEffect(() => {
        const setTrainingInProgress = async () => {
            await AsyncStorage.setItem(TRAINING_IN_PROGRESS_KEY, 'true');
            dispatch(trainingActions.setInProgress(true));
        }

        setTrainingInProgress();
    }, [dispatch]);

    useEffect(() => {
        const updateAsyncExercises = async () => {
            await AsyncStorage.setItem(TRAINING_EXERCISES_KEY, JSON.stringify(exerciseSelects));
        }

        Object.keys(exerciseSelects).length > 0 && updateAsyncExercises();
    }, [exerciseSelects]);

    useEffect(() => {
        dispatch(getLastTrainings(user?.userId));
    }, [dispatch, user]);

    const resetTraining = async () => {
        dispatch(trainingActions.setInProgress(false));
        dispatch(trainingActions.resetTrainingTime());
        dispatch(exerciseActions.cleanExercises());
        timerRef.current?.resetTimer();
        await clearAsyncStorageFromTraining();
    }

    const handleAddExerciseSelect = (exerciseNames: string[]) => {
        if (exerciseNames.length > 0) {
            const newExercises = exerciseNames.map((exercise, index) => ({
                id: Date.now() + index,
                exerciseName: exercise,
            }));

            dispatch(exerciseActions.appendExercises(newExercises));
        }

        setIsModalVisible(false);
    };

    const handleRemoveExerciseSelect = (id: number) => {
        dispatch(exerciseActions.removeExercise(id));
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
    }

    const handlePauseTimer = async () => {
        const timerIsRunning = await AsyncStorage.getItem(TIMER_IS_RUNNING_KEY);

        if (timerIsRunning === 'true') {
            await AsyncStorage.setItem(TIMER_IS_RUNNING_KEY, 'false');
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-secondaryBrown");
            dispatch(trainingActions.setBgClass("bg-secondaryBrown"));
            dispatch(timerActions.setIsRunning(false));
        } else {
            await AsyncStorage.setItem(TIMER_IS_RUNNING_KEY, 'true');
            await AsyncStorage.setItem(BG_CLASS_KEY, "bg-secondaryGreen");
            dispatch(trainingActions.setBgClass("bg-secondaryGreen"));
            dispatch(timerActions.setIsRunning(true));
        }
    }

    const handleSaveTraining = async () => {
        try {
            if (Object.values(exerciseSelects).length > 0) {
                let anyErrors = false;
                const exercises: Record<number, ExerciseType> = {};
                Object.entries(exerciseSelects).forEach(([id, exercise]) => {
                    const series = exercise.series.map((serie) => {
                        const isDoneError = serie.isDone ? false : true;
                        const repsError = serie.reps ? false : true;
                        const weightError = serie.weight ? false : true;


                        if (isDoneError || repsError || weightError) {
                            anyErrors = true;
                        }
                        return {
                            ...serie,
                            isDoneError,
                            repsError,
                            weightError,
                        }
                    })

                    exercises[Number(id)] = {
                        exerciseName: exercise.exerciseName,
                        series,
                    }
                })

                if (anyErrors) {
                    dispatch(exerciseActions.replaceExercises(exercises))
                    Vibration.vibrate();
                    throw new Error("Uzupełnij wszystkie pola");
                }

                const cleanedExercises = Object.values(exercises).map((exercise) => {
                    const cleanedSeries = exercise.series.map(({ reps, weight, ...rest }) => ({ reps, weight }))
                    return {
                        exerciseName: exercise.exerciseName,
                        series: cleanedSeries,
                    }
                });
                console.log(cleanedExercises);

                await updateUserTraining(user, cleanedExercises, selectedDate.toISOString());
                await resetTraining();
                router.dismiss(1);
                Alert.alert("Trening zapisany");
            } else {
                throw Error("Dodaj ćwiczenie");
            }
        } catch (e: any) {
            let errorMessage = "Wystąpił nieoczekiwany błąd";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            Alert.alert(errorMessage);
        }
    };

    return (
        <View className="flex-1 h-full">
            <View className="relative bg-background-600" style={{ height: hp(20) }}>
                <Image style={styles.avatarImage} source={require('@/assets/images/hero-avatar.png')} />
                <View style={styles.floorBg} className="bg-background-700 h-2/5" />
            </View>
            <View className={`pt-4 px-6 pb-12 ${bgClass} flex-grow flex-col`}>
                <View className="mb-4 flex-col">
                    <View className="flex-row justify-between mb-1">
                        <Text style={styles.title}>New Workout</Text>
                        <Timer ref={timerRef} isRunning={timerIsRunning} mode="up" textProps={{ style: [styles.title, { opacity: timerIsRunning ? 1 : .4 }] }} />
                    </View>
                    <View>
                        <Text style={styles.subtitle}>{displayedDate}</Text>
                    </View>
                </View>
                <View className="pb-4 flex-grow">
                    <ScrollView className="h-1" showsVerticalScrollIndicator={false}>
                        {Object.entries(exerciseSelects).map(([id, exercise]) =>
                            <ExerciseDetails
                                key={id}
                                exerciseId={Number(id)}
                                exerciseName={exercise.exerciseName}
                                onRemove={() => handleRemoveExerciseSelect(Number(id))}
                            />
                        )}
                        <ButtonComponent onPress={handleOpenModal} title="Add exercise" variant="dashed" />
                    </ScrollView>
                </View>
                <View className="flex-row gap-4">
                    <ButtonComponent onPress={handleSaveTraining} title="Finish" />
                    <ButtonComponent title={`${timerIsRunning ? "Pause" : "Resume"}`} variant="secondary" onPress={handlePauseTimer} />
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                className="bg-transparent p-12"
                visible={isModalVisible}
                onRequestClose={handleCloseModal}
            >
                <ExerciseModal onAddExercise={handleAddExerciseSelect} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: hp(2.4),
        fontWeight: "bold",
        color: 'white',
        fontFamily: 'Rubik_700Bold_Italic',
    },
    subtitle: {
        fontSize: 10,
        fontWeight: "200",
        color: 'white',
        fontFamily: "Roboto_400Regular",
    },
    selectArrow: {
        position: "absolute",
        right: "5%"
    },
    buttonText: {
        fontSize: hp(1.8),
        color: "white",
        fontWeight: "medium",
    },
    removeButton: {
        aspectRatio: "1/1",
    },
    avatarImage: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: '-50%' }],
        zIndex: 3,
        bottom: '7%',
        height: '60%',
        resizeMode: 'contain',
    },
    floorBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
})