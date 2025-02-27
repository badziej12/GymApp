import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const ExerciseDetails = () => {
    const [exerciseSelects, setExerciseSelects] = useState([{ id: Date.now() }]);

    const addExerciseSelect = () => {
        setExerciseSelects([...exerciseSelects, { id: Date.now() }]);
    };
    
    const removeExerciseSelect = (id: number) => {
        setExerciseSelects(exerciseSelects.filter(exercise => exercise.id !== id));
    };
    
    return (
        <View className="flex-col">
            <View className="flex-row mb-2">
                <View className="w-2/12">
                    <Text style={styles.itemCopy}>Seria</Text>
                </View>
                <View className="w-4/12">
                    <Text style={styles.itemCopy}>Powtórzenia</Text>
                </View>
                <View className="w-4/12">
                    <Text style={styles.itemCopy}>Cięzar</Text>
                </View>
            </View>
            {exerciseSelects.map((exercise, index) => (
                <View key={exercise.id} className="flex-row mb-2">
                    <View className="w-2/12 items-center">
                        <View className="bg-slate-300 w-2/3 py-3 rounded-xl">
                            <Text style={styles.itemCopy}>{index + 1}</Text>
                        </View>
                    </View>
                    <View className="w-4/12 px-8">
                        <TextInput 
                            inputMode={"numeric"}
                            className="flex-1 bg-slate-200 px-4 rounded-xl text-neutral-700 text-center"
                            placeholder="8"
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View className="w-4/12 px-8">
                        <TextInput 
                            inputMode={"numeric"}
                            className="flex-1 bg-slate-200 px-4 rounded-xl text-neutral-700 text-center"
                            placeholder="60"
                            placeholderTextColor={'gray'}
                        />
                    </View>
                    <View className="w-2/12 px-4 justify-center">
                        <Pressable onPress={() => removeExerciseSelect(exercise.id)} className="bg-red-600 py-2 rounded-xl justify-center items-center">
                            <FontAwesome size={18} name={"remove"} color={"white"} />
                        </Pressable>
                    </View>
                </View>
            ))}
            <Pressable onPress={addExerciseSelect} className="bg-blue-200 items-center rounded-xl py-2 mb-6 border">
                <Text style={styles.buttonText}>Dodaj serię</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    itemCopy: {
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonText: {
        fontSize: hp(1.8),
        color: "white",
        fontWeight: "medium",
    },
});