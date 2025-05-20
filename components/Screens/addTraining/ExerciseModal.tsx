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
    onAddExercise: (exerciseName: string) => void,
}

const ExerciseModal: FC<ExerciseModalProps> = ({ isModalVisible, onCloseModal, onAddExercise }) => {
    const [searchText, setSearchText] = useState("");
    const [selectedTraining, setSelectedTraining] = useState("");
    const [trainings, setTrainings] = useState<string[]>([]);

    const groupedTrainings = trainings
        .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc: Record<string, string[]>, training) => {
            const letter = training[0].toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(training);
            return acc;
        }, {});

    const handleSearchChange = (value: string) => {
        setSearchText(value);
    }

    const handleSelectTraining = (name: string) => {
        setSelectedTraining(name);
    }

    const fetchTrainings = async () => {
        const docSnap = await getDocs(trainingsRef);
        setTrainings(docSnap.docs[0].get("trainings"));
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
                                <Pressable onPress={() => onAddExercise(selectedTraining)} className=""><Text className="uppercase text-sunny" style={styles.heading}>Add+</Text></Pressable>
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
                                            <TrainingCard key={training} trainingName={training} selectedTraining={selectedTraining} onSelectTraining={handleSelectTraining} />
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
