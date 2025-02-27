import { trainingsRef, usersRef } from "@/firebaseConfig";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseSelect } from "@/components/ExerciseSelect";
import { useAuth } from "@/context/authContext";
import { useDate } from "@/context/dateContext";
import { router } from "expo-router";

export type SeriesType = {
    reps: string,
    weight: string,
}

export type FullExerciseRefType = {
    exerciseName: string,
    series: SeriesType[],
}


export default function AddTraining() {
    const { selectedDate } = useDate();
    const { user } = useAuth();
    const [trainings, setTrainings] = useState([]);
    const [exerciseSelects, setExerciseSelects] = useState([{ id: Date.now() }]);
    const exercisesSelectRef = useRef<{ getExercise: () => FullExerciseRefType | null}[]>([]);
    const fullTrainingRef = useRef<FullExerciseRefType[]>([]);

    const fetchTrainings = async () => {
        const docSnap =  await getDocs(trainingsRef);
        setTrainings(docSnap.docs[0].get("trainings"));
    }

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

    useEffect(() => {
        fetchTrainings();
    }, [])
    
    const addExerciseSelect = () => {
        setExerciseSelects([...exerciseSelects, { id: Date.now() }]);
    };

    const removeExerciseSelect = (id: number) => {
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
        <SafeAreaView className="flex-1 h-full">
            <View className="pt-10 flex-col h-full">
                <View className="border-b-2 px-5 pb-4">
                    <Text style={styles.inputLabel}>Wybierz ćwiczenia</Text>
                </View>
                <ScrollView className="flex-col px-5 pt-4 bg-slate-200">
                    {exerciseSelects.map((exercise, index) => (
                        <ExerciseSelect
                            ref={el => {
                                if (el) {
                                    exercisesSelectRef.current[index] = el;
                                }
                            }}
                            key={exercise.id}
                            trainings={trainings}
                            onRemove={() => removeExerciseSelect(exercise.id)}
                        />
                    ))}
                </ScrollView>
                <View className="flex-col px-5 pt-4 border-t-2"> 
                    <Pressable onPress={addExerciseSelect} className="bg-indigo-400 items-center rounded-xl py-4 mb-6 border-2">
                        <Text style={styles.buttonText}>Dodaj ćwiczenie</Text>
                    </Pressable>
                    <Pressable onPress={handleSaveTraining} className="bg-green-500 items-center rounded-xl py-4 border-2">
                        <Text style={styles.buttonText}>Zapisz trening</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inputLabel: {
        fontSize: hp(2),
        fontWeight: "bold",
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
})