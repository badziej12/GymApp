import { FC, useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchComponent from "./SearchComponent";
import ExerciseCard from "./ExerciseCard";
import { trainingsRef } from "@/firebaseConfig";
import { getDocs } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { exerciseActions } from "@/store/exercise/exercise-slice";

type ExerciseModalProps = {
    onAddExercise: (exerciseName: string[]) => void,
}

export type AvailableExerciseType = {
    name: string;
    category: string[];
}

const ExerciseModal: FC<ExerciseModalProps> = ({ onAddExercise }) => {
    const [searchText, setSearchText] = useState("");
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const availableExercises = useAppSelector(state => state.exercise.availableExercises);
    const dispatch = useAppDispatch();

    const groupedAvailableExercises = availableExercises
        .filter(training => training.name.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        .reduce((acc: Record<string, AvailableExerciseType[]>, training) => {
            const letter = training.name[0].toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(training);
            return acc;
        }, {});

    const handleSearchChange = (value: string) => {
        setSearchText(value);
    }

    const handleSelectExercise = (name: string) => {
        setSelectedExercises((currentSelectedExercises) => {
            const newSelectedExercises =
                currentSelectedExercises.includes(name)
                    ? currentSelectedExercises.filter(currentSelectedExercises => currentSelectedExercises !== name)
                    : [...currentSelectedExercises, name];

            return newSelectedExercises;
        });
    }

    useEffect(() => {
        const fetchAvailableExercises = async () => {
            const docSnap = await getDocs(trainingsRef);
            const data = docSnap.docs.map(training => training.data()) as AvailableExerciseType[];
            dispatch(exerciseActions.setAvailableExercises(data));
        }

        fetchAvailableExercises();
    }, [])

    return (
        <View className="px-2 py-8 flex-1" style={{ backgroundColor: "#000000BF" }}>
            <SafeAreaProvider>
                <SafeAreaView className="flex-1">
                    <View className="p-4 h-full" style={{ backgroundColor: "#414141", padding: 16 }}>
                        <View className="flex-row justify-between mb-4">
                            <Text style={styles.heading} className="uppercase text-white">Add new exercise</Text>
                            <Pressable onPress={() => onAddExercise(selectedExercises)} className=""><Text className="uppercase text-sunny" style={styles.heading}>Add+</Text></Pressable>
                        </View>
                        <SearchComponent searchText={searchText} onSearchChange={handleSearchChange} />
                        <ScrollView >
                            {Object.keys(groupedAvailableExercises).map(letter => (
                                <View key={letter} className="mb-4">
                                    <View className="flex-row items-center mb-4">
                                        <Text style={styles.letterHeading}>{letter}</Text>
                                        <View className="h-0.5 w-full bg-white" />
                                    </View>
                                    {groupedAvailableExercises[letter].map(exercise => (
                                        <ExerciseCard key={exercise.name} exerciseName={exercise.name} exerciseCategory={exercise.category} selectedExercises={selectedExercises} onSelectedExercise={handleSelectExercise} />
                                    ))}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    )
}

export default ExerciseModal;

const styles = StyleSheet.create({
    heading: {
        fontFamily: "Rubik_700Bold_Italic",
        fontSize: hp(2),
    },
    letterHeading: {
        fontFamily: "Rubik_700Bold_Italic",
        color: "white",
        marginRight: 8,
    },
})
