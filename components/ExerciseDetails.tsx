import { FontAwesome } from "@expo/vector-icons";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const ExerciseDetails = forwardRef((props, ref) => {
    const [serieSelects, setserieSelects] = useState([{ id: Date.now(), reps: '', weight: '' }]);

    const repRef = useRef<string[]>([]);
    const weightRef = useRef<string[]>([]);

    useImperativeHandle(ref, () => ({
        getReps: () => repRef.current,
        getWeights: () => weightRef.current,
    }));

    const addSerieSelect = () => {
        const previousReps = repRef.current[repRef.current.length - 1] || "";
        const previousWeight = weightRef.current[weightRef.current.length - 1] || "";
        if (previousReps && previousWeight || serieSelects.length == 0) {
            setserieSelects([...serieSelects, { id: Date.now(), reps: previousReps, weight: previousWeight }]);
            usePreviousValues(previousReps, previousWeight);
        } else {
            return;
        }
    };
    
    const removeSerieSelect = (id: number, index: number) => {
        setserieSelects(serieSelects.filter(exercise => exercise.id !== id));
        repRef.current.splice(index, 1);
        weightRef.current.splice(index, 1);
    };

    const usePreviousValues = (previousReps: string, previousWeight: string) => {
        repRef.current.push(previousReps);
        weightRef.current.push(previousWeight);
    }
    
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
            {serieSelects.map((exercise, index) => (
                <View key={exercise.id} className="flex-row mb-2">
                    <View className="w-2/12 items-center">
                        <View className="bg-slate-300 w-2/3 py-3 rounded-xl">
                            <Text style={styles.itemCopy}>{index + 1}</Text>
                        </View>
                    </View>
                    <View className="w-4/12 px-8">
                        <TextInput 
                            inputMode={"numeric"}
                            onChangeText={value => {
                                const newserieSelects = [...serieSelects];
                                newserieSelects[index].reps = value;
                                setserieSelects(newserieSelects);
                                repRef.current[index] = value;
                            }}
                            className="flex-1 bg-blue-200 px-4 rounded-xl text-neutral-700 text-center"
                            value={exercise.reps}
                            placeholderTextColor={"black"}
                        />
                    </View>
                    <View className="w-4/12 px-8">
                        <TextInput 
                            value={exercise.weight}
                            onChangeText={value => {
                                const newserieSelects = [...serieSelects];
                                newserieSelects[index].weight = value;
                                setserieSelects(newserieSelects);
                                weightRef.current[index] = value;
                            }}
                            inputMode={"numeric"}
                            className="flex-1 bg-blue-200 px-4 rounded-xl text-neutral-700 text-center"
                        />
                    </View>
                    <View className="w-2/12 px-4 justify-center">
                        <Pressable onPress={() => removeSerieSelect(exercise.id, index)} className="bg-red-600 py-2 rounded-xl justify-center items-center">
                            <FontAwesome size={18} name={"remove"} color={"white"} />
                        </Pressable>
                    </View>
                </View>
            ))}
            <Pressable onPress={addSerieSelect} className="bg-amber-400 items-center rounded-lg py-2 mb-6 border">
                <Text style={styles.buttoSeriesText}>Dodaj serię</Text>
            </Pressable>
        </View>
    )
});

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
    buttoSeriesText: {
        fontSize: hp(1.5),
        color: "black",
        fontWeight: "medium",
    },
});