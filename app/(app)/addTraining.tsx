import { usersRef } from "@/firebaseConfig";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseSelect } from "@/components/ExerciseSelect";
import { useAuth } from "@/context/authContext";
import { useDate } from "@/context/dateContext";
import { router } from "expo-router";
import { ButtonComponent } from "@/components/Buttons/ButtonComponent";
import ExerciseModal from "@/components/Screens/addTraining/ExerciseModal";
import ExerciseDetails from "@/components/ExerciseDetails";

export type SeriesType = {
    reps: string,
    weight: string,
}

export type FullExerciseRefType = {
    exerciseName: string,
    series: SeriesType[],
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Thursday", "Wensday", "Friday", "Saturday"];

export default function AddTraining() {
    const { selectedDate } = useDate();
    const { user } = useAuth();
    const [exerciseSelects, setExerciseSelects] = useState<{ id: number, exerciseName: string }[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const exercisesSelectRef = useRef<{ getExercise: () => FullExerciseRefType | null }[]>([]);
    const fullTrainingRef = useRef<FullExerciseRefType[]>([]);

    const dayOfTheMonth = selectedDate.getDate();
    const monthNumber = selectedDate.getMonth();
    const yearNumber = selectedDate.getFullYear();
    const displayedDate = `${dayOfTheMonth}.${monthNumber}.${yearNumber} - ${dayNames[selectedDate.getDay()]}`;

    const updateUserTraining = async (fullTraining: FullExerciseRefType[]) => {
        const userRef = doc(usersRef, user?.userId);
        const userTrainingsRef = collection(userRef, "trainings");

        try {
            await addDoc(userTrainingsRef, {
                date: selectedDate.toDateString(),
                exercises: fullTraining,
            })

            router.dismiss(1);
        } catch (e) {
            console.error("Error adding document: ", e);
            fullTrainingRef.current = [];
            throw e;
        }

    }

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
        setExerciseSelects(exerciseSelects.filter(exercise => exercise.id !== id));
    };

    const handleSaveTraining = () => {
        exercisesSelectRef.current.forEach((ref) => {
            const exercise = ref.getExercise();
            if (exercise) {
                fullTrainingRef.current.push(exercise);
            }
        });

        if (fullTrainingRef.current.length > 0) {
            updateUserTraining(fullTrainingRef.current);
        }
    };

    return (
        <View className="flex-1 h-full">
            <View className="relative bg-background-600" style={{ height: hp(20) }}>
                <Image style={styles.avatarImage} source={require('@/assets/images/hero-avatar.png')} />
                <View style={styles.floorBg} className="bg-background-700 h-2/5" />
            </View>
            <View className="pt-4 px-6 pb-12 bg-secondaryGreen flex-grow flex-col">
                <View className="mb-4 flex-col">
                    <View className="flex-row justify-between mb-1">
                        <Text style={styles.title}>New Workout</Text>
                        <Text style={styles.title}>0:02</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>{displayedDate}</Text>
                    </View>
                </View>
                <ScrollView className="flex-col">
                    {exerciseSelects.map((exercise, index) =>
                        <ExerciseDetails
                            ref={el => {
                                if (el) {
                                    exercisesSelectRef.current[index] = el;
                                }
                            }}
                            key={exercise.id}
                            exerciseName={exercise.exerciseName}
                            onRemove={() => handleRemoveExerciseSelect(exercise.id)}
                        />
                    )}
                    <ButtonComponent onPress={handleOpenModal} title="Add exercise" variant="dashed" />
                </ScrollView>
                <View className="flex-row gap-4">
                    <ButtonComponent onPress={handleSaveTraining} title="Finish" />
                    <ButtonComponent title="Pause" variant="secondary" />
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
        fontSize: hp(1.2),
        fontWeight: "200",
        color: 'white',
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