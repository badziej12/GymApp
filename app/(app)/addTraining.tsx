import { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert, Vibration } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from "expo-router";
import { ButtonComponent } from "@/components/Buttons/ButtonComponent";
import ExerciseModal from "@/components/Screens/addTraining/ExerciseModal";
import ExerciseDetails from "@/components/ExerciseDetails";
import Timer from "@/components/Timer/Timer";
import { useAppSelector } from "@/store/store";
import { updateUserTraining } from "@/utils/updateUserTraining";

type SerieType = {
    reps: string,
    weight: string,
}

export type SerieRowType = {
    id: number;
    reps: string;
    weight: string;
    isDone: boolean;
}

export type ExerciseType = {
    exerciseName: string,
    series: SerieRowType[],
}

export type CleanExerciseType = {
    exerciseName: string,
    series: SerieType[],
}

export type BackgroundClassType = "bg-secondaryGreen" | "bg-secondaryBrown" | "bg-azure";

const dayNames = ["Sunday", "Monday", "Tuesday", "Thursday", "Wensday", "Friday", "Saturday"];

export default function AddTraining() {
    const selectedDateString = useAppSelector(state => state.date.selectedDate);
    const user = useAppSelector(state => state.auth.user);
    const [bgClass, setBgClass] = useState<BackgroundClassType>("bg-secondaryGreen");
    const [exerciseSelects, setExerciseSelects] = useState<{ id: number, exerciseName: string }[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [timerIsRunning, setTimerIsRunning] = useState(true);
    const exerciseRefs = useRef<Record<number, { getExercise: () => ExerciseType }>>({});

    const selectedDate = new Date(selectedDateString);

    const dayOfTheMonth = selectedDate.getDate();
    const monthNumber = selectedDate.getMonth();
    const yearNumber = selectedDate.getFullYear();
    const displayedDate = `${dayOfTheMonth}.${monthNumber}.${yearNumber} - ${dayNames[selectedDate.getDay()]}`;


    const handleAddExerciseSelect = (exerciseName: string) => {
        setExerciseSelects((prevExercises) => [...prevExercises, { id: Date.now(), exerciseName }]);
        setIsModalVisible(false);
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
    }

    const handleRemoveExerciseSelect = (id: number) => {
        setExerciseSelects(prev => prev.filter(exercise => exercise.id !== id));
        delete exerciseRefs.current[id];
    };

    const handlePauseTimer = () => {
        setTimerIsRunning(wasRunning => {
            if (!wasRunning) {
                setBgClass("bg-secondaryGreen");
            } else {
                setBgClass("bg-secondaryBrown");
            }

            return !wasRunning;
        });
    }

    const handleSwitchBgClass = (bgClass: BackgroundClassType) => {
        setBgClass(bgClass);
    }

    const handleSaveTraining = async () => {
        try {
            const exercises = Object.values(exerciseRefs.current).map(ref => ref.getExercise()) as ExerciseType[];

            exercises.forEach(exercise => {
                exercise?.series.forEach((serie) => {
                    if (!serie.isDone || !serie.reps || !serie.weight) {
                        Vibration.vibrate();
                        throw new Error("Nie uzupełniono wszystkich serii");
                    }
                })
            })

            const cleanedExercises = exercises.map((exercise) => {
                const cleanedSeries = exercise.series.map(({ id, isDone, ...rest }) => rest)
                return {
                    exerciseName: exercise.exerciseName,
                    series: cleanedSeries,
                }
            });

            if (exercises.length > 0) {
                await updateUserTraining(user!, exercises, selectedDate.toISOString());
                router.dismiss(1);
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
                        <Timer isRunning={timerIsRunning} mode="up" textProps={{ style: [styles.title, { opacity: timerIsRunning ? 1 : .4 }] }} />
                    </View>
                    <View>
                        <Text style={styles.subtitle}>{displayedDate}</Text>
                    </View>
                </View>
                <View className="pb-4 flex-grow">
                    <ScrollView className="h-1" showsVerticalScrollIndicator={false}>
                        {exerciseSelects.map((exercise) =>
                            <ExerciseDetails
                                ref={el => {
                                    if (el) {
                                        exerciseRefs.current[exercise.id] = {
                                            getExercise: el.getExercise,
                                        };
                                    } else {
                                        delete exerciseRefs.current[exercise.id];
                                    }
                                }}
                                key={exercise.id}
                                exerciseName={exercise.exerciseName}
                                onRemove={() => handleRemoveExerciseSelect(exercise.id)}
                                switchBgClass={handleSwitchBgClass}
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
            <ExerciseModal onCloseModal={handleCloseModal} isModalVisible={isModalVisible} onAddExercise={handleAddExerciseSelect} />
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