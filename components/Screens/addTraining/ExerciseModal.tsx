import { FC, useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchComponent from "./SearchComponent";
import TrainingCard from "./TrainingCard";
import { trainingsRef } from "@/firebaseConfig";
import { getDocs } from "firebase/firestore";

type ExerciseModalProps = {
    isModalVisible: boolean,
    onCloseModal: () => void,
    onAddExercise: (exerciseName: string[]) => void,
}

type TrainingsType = {
    name: string;
    category: string[];
}

const ExerciseModal: FC<ExerciseModalProps> = ({ isModalVisible, onCloseModal, onAddExercise }) => {
    const [searchText, setSearchText] = useState("");
    const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);
    const [trainings, setTrainings] = useState<TrainingsType[]>([]);

    const groupedTrainings = trainings
        .filter(training => training.name.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        .reduce((acc: Record<string, TrainingsType[]>, training) => {
            const letter = training.name[0].toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(training);
            return acc;
        }, {});

    const handleSearchChange = (value: string) => {
        setSearchText(value);
    }

    const handleSelectTraining = (name: string) => {
        setSelectedTrainings((currentSelectedTrainings) => {
            const newSelectedTrainingss =
                currentSelectedTrainings.includes(name)
                    ? currentSelectedTrainings.filter(currentSelectedTrainings => currentSelectedTrainings !== name)
                    : [...currentSelectedTrainings, name];

            return newSelectedTrainingss;
        });
    }

    const fetchTrainings = async () => {
        const docSnap = await getDocs(trainingsRef);
        const trainings = docSnap.docs.map(training => training.data()) as TrainingsType[];
        setTrainings(trainings);
    }

    useEffect(() => {
        fetchTrainings();
    }, [])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            className="bg-transparent gowno p-12"
            visible={isModalVisible}
            onRequestClose={() => {
                onCloseModal();
            }}
        >
            <View className="px-2 py-8 flex-1" style={{ backgroundColor: "#000000BF" }}>
                <SafeAreaProvider>
                    <SafeAreaView className="flex-1">
                        <View className="p-4 h-full" style={{ backgroundColor: "#414141", padding: 16 }}>
                            <View className="flex-row justify-between mb-4">
                                <Text style={styles.heading} className="uppercase text-white">Add new exercise</Text>
                                <Pressable onPress={() => onAddExercise(selectedTrainings)} className=""><Text className="uppercase text-sunny" style={styles.heading}>Add+</Text></Pressable>
                            </View>
                            <SearchComponent searchText={searchText} onSearchChange={handleSearchChange} />
                            <ScrollView >
                                {Object.keys(groupedTrainings).map(letter => (
                                    <View key={letter} className="mb-4">
                                        <View className="flex-row items-center mb-4">
                                            <Text style={styles.letterHeading}>{letter}</Text>
                                            <View className="h-0.5 w-full bg-white" />
                                        </View>
                                        {groupedTrainings[letter].map(training => (
                                            <TrainingCard key={training.name} trainingName={training.name} trainingCategory={training.category} selectedTrainings={selectedTrainings} onSelectTraining={handleSelectTraining} />
                                        ))}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </View>
        </Modal>


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
