import { trainingsRef } from "@/firebaseConfig";
import { doc, getDocs } from "firebase/firestore";
import SelectDropdown from 'react-native-select-dropdown'
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ExerciseSelect } from "@/components/ExerciseSelect";


export default function AddTraining() {
    const [trainings, setTrainings] = useState([]);
    const [exerciseSelects, setExerciseSelects] = useState([{ id: Date.now() }]);

    const fetchTrainings = async () => {
        const docSnap =  await getDocs(trainingsRef);
        setTrainings(docSnap.docs[0].get("trainings"));
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

    return (
        <SafeAreaView className="flex-1">
            <View className="px-5 pt-10">
                <View className="mb-4">
                    <Text style={styles.inputLabel}>Wybierz ćwiczenia</Text>
                </View>
                {exerciseSelects.map((exercise) => (
                    <ExerciseSelect
                        key={exercise.id}
                        trainings={trainings}
                        onRemove={() => removeExerciseSelect(exercise.id)}
                    />
                ))}
                <Pressable onPress={addExerciseSelect} className="bg-indigo-400 items-center rounded-xl py-4 mb-6 border-2">
                    <Text style={styles.buttonText}>Dodaj ćwiczenie</Text>
                </Pressable>
                <Pressable className="bg-green-500 items-center rounded-xl py-4 border-2">
                    <Text style={styles.buttonText}>Zapisz trening</Text>
                </Pressable>
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