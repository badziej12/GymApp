import { FullExerciseRefType, SeriesType } from "@/app/(app)/addTraining";
import { FontAwesome } from "@expo/vector-icons";
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type ExerciseDetailsProps = {
    onRemove: () => void;
    exerciseName: string;
}

type RefType = {
    getExercise: () => FullExerciseRefType | null,
}

const ExerciseDetails = forwardRef<RefType, ExerciseDetailsProps>(({ onRemove, exerciseName }, ref) => {
    const [serieSelects, setserieSelects] = useState([{ id: Date.now(), reps: '', weight: '' }]);

    const fullExerciseRef = useRef<FullExerciseRefType | null>(null);
    const repRef = useRef<string[]>([]);
    const weightRef = useRef<string[]>([]);


    useImperativeHandle(ref, () => ({
        getExercise: () => showRef()
    }));

    const showRef = () => {
        const reps = repRef.current;
        const weights = weightRef.current;

        const series: SeriesType[] = [];

        for (let i = 0; i < reps.length; i++) {
            if (weights[i] && reps[i]) {
                series.push({ reps: reps[i], weight: weights[i] });
            }
        }

        if (series.length > 0) {
            fullExerciseRef.current = {
                exerciseName: exerciseName,
                series: series
            };
        }

        return fullExerciseRef.current;
    };

    const addSerieSelect = () => {
        const previousReps = repRef.current[repRef.current.length - 1] || "";
        const previousWeight = weightRef.current[weightRef.current.length - 1] || "";
        if (previousReps && previousWeight || serieSelects.length == 0) {
            setserieSelects(prevSerie => [...prevSerie, { id: Date.now(), reps: previousReps, weight: previousWeight }]);
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
        <View style={{ borderWidth: 1 }} className="flex-col p-4 border-background-200 mb-4">
            <View className="mb-4 flex-row justify-between">
                <Text style={styles.trainingName} className="text-sunny uppercase">{exerciseName}</Text>
                <Pressable onPress={onRemove}><Text style={styles.trainingName} className="text-white">?</Text></Pressable>
            </View>
            <View className="flex-row mb-2 justify-between">
                <View className="w-1/12">
                    <Text style={styles.itemCopy}>Set</Text>
                </View>
                <View className="w-4/12 px-2">
                    <Text style={styles.itemCopy}>Previous</Text>
                </View>
                <View className="w-2/12">
                    <Text style={styles.itemCopy}>Kg</Text>
                </View>
                <View className="w-2/12">
                    <Text style={styles.itemCopy}>Reps</Text>
                </View>
                <View className="w-1/12">
                    <Text className="text-center" style={styles.itemCopy}>?</Text>
                </View>
            </View>
            {serieSelects.map((exercise, index) => (
                <View key={exercise.id} className="flex-row mb-2 justify-between">
                    <View className="w-1/12 items-center">
                        <View style={styles.inputBox} className="">
                            <Text className="text-center" style={styles.itemCopy}>{index + 1}</Text>
                        </View>
                    </View>
                    <View className="w-4/12 px-2">
                        <Text style={styles.previousReps}>+5kg x 10</Text>
                    </View>
                    <View className="w-2/12">
                        <TextInput
                            style={styles.inputBox}
                            value={exercise.weight}
                            onChangeText={value => {
                                const newserieSelects = [...serieSelects];
                                newserieSelects[index].weight = value;
                                setserieSelects(newserieSelects);
                                weightRef.current[index] = value;
                            }}
                            inputMode={"numeric"}
                            className="flex-1 px-4 text-center"
                        />
                    </View>
                    <View className="w-2/12">
                        <TextInput
                            style={styles.inputBox}
                            inputMode={"numeric"}
                            onChangeText={value => {
                                const newserieSelects = [...serieSelects];
                                newserieSelects[index].reps = value;
                                setserieSelects(newserieSelects);
                                repRef.current[index] = value;
                            }}
                            className="flex-1 text-center"
                            value={exercise.reps}
                            placeholderTextColor={"black"}
                        />
                    </View>
                    <View className="w-1/12">
                        <Pressable className="h-full" style={styles.inputBox} />
                    </View>
                    {/* <View className="w-2/12 px-4 justify-center">
                        <Pressable onPress={() => removeSerieSelect(exercise.id, index)} className="bg-red-600 py-2 rounded-xl justify-center items-center">
                            <FontAwesome size={18} name={"remove"} color={"white"} />
                        </Pressable>
                    </View> */}
                </View>
            ))}
            <Pressable onPress={addSerieSelect} className="flex-row px-4 py-2 mb-4">
                <View className="flex-grow" style={styles.buttonSeriesLeftLine} />
                <Text className="mx-4" style={styles.buttoSeriesText}>Add set</Text>
                <View className="flex-grow" style={styles.buttonSeriesRightLine} />
            </Pressable>
            <Pressable style={styles.restButton} className="flex-row justify-between px-2 py-1">
                <Text style={styles.restButtonCopy}>Rest</Text>
                <Text style={styles.restButtonCopy}>0:26</Text>
            </Pressable>
        </View>
    )
});

export default ExerciseDetails;

const styles = StyleSheet.create({
    trainingName: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 12,
    },
    inputBox: {
        backgroundColor: "#00000080",
        borderColor: "#000000CC",
        borderWidth: 1,
        color: "white",
        height: 16,
        fontSize: 12,
        width: '100%',
        textAlign: 'center',
        fontFamily: "Roboto_400Regular",
    },
    previousReps: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: 'white',
    },
    itemCopy: {
        color: "white",
        fontFamily: "Roboto_700Bold",
        fontSize: 12,
    },
    buttonText: {
        fontSize: hp(1.8),
        color: "white",
        fontWeight: "medium",
    },
    buttoSeriesText: {
        fontSize: 14,
        color: "white",
        textTransform: "uppercase",
        fontFamily: "Montserrat_700Bold_Italic",
        transform: [{ translateY: 7 }],
    },
    buttonSeriesLeftLine: {
        borderColor: "white",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
    },
    buttonSeriesRightLine: {
        borderColor: "white",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    restButton: {
        borderWidth: 1,
        borderColor: "#E3B600",
        backgroundColor: "#FFD500",
    },
    restButtonCopy: {
        fontSize: 11,
        fontFamily: "Montserrat_700Bold_Italic",
    }
});