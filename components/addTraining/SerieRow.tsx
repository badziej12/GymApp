import { FC, Ref, RefObject, useImperativeHandle, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Vibration } from "react-native";
import SwipeableItem from 'react-native-swipeable-item';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export type SerieRowRefType = {
    getSerie: () => {
        reps: string;
        weight: string;
        isDone: boolean;
    }
}

type SerieRowProps = {
    onRemoveSerieSelect: (id: number) => void;
    id: number;
    initialWeight: string;
    initialReps: string;
    ref: Ref<SerieRowRefType>;
}

const SerieRow: FC<SerieRowProps> = ({ onRemoveSerieSelect, id, initialWeight, initialReps, ref }) => {
    const [isDone, setIsDone] = useState(false);
    const [isEmpty, setIsEmpty] = useState({ reps: false, weight: false });
    const [weightValue, setWeightValue] = useState(initialWeight);
    const [repsValue, setRepsValue] = useState(initialReps);

    const handleDonePress = () => {
        setIsDone(prev => {
            !prev && Vibration.vibrate();
            return !prev;
        });
    }

    useImperativeHandle(ref, () => ({
        getSerie: () => getSerie()
    }));

    const getSerie = () => {
        if (!repsValue) {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    reps: true
                }
            });
        } else {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    reps: false
                }
            });
        }

        if (!weightValue) {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    weight: true
                }
            });
        } else {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    weight: false
                }
            });
        }

        return { reps: repsValue, weight: weightValue, isDone };
    }

    return (
        <View className="mb-2">
            <SwipeableItem
                item={serie}
                overSwipe={200}
                snapPointsLeft={[120]}
                snapPointsRight={[]}
                onChange={({ openDirection }) => {
                    console.log(openDirection);
                    if (openDirection === 'left') {
                        onRemoveSerieSelect(id);
                    }
                }}
            >
                <Animated.View
                    entering={FadeInRight}
                    exiting={FadeOutLeft}
                >
                    <View className="flex-row justify-between">
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
                                style={[styles.inputBox, { backgroundColor: isEmpty.weight ? "red" : "#00000080" }]}
                                inputMode={"numeric"}
                                className="flex-1 px-4 text-center"
                                onChangeText={setWeightValue}
                                value={weightValue}
                            />
                        </View>
                        <View className="w-2/12">
                            <TextInput
                                style={[styles.inputBox, , { backgroundColor: isEmpty.reps ? "red" : "#00000080" }]}
                                inputMode={"numeric"}
                                className="flex-1 text-center"
                                placeholderTextColor={"black"}
                                onChangeText={setRepsValue}
                                value={repsValue}
                            />
                        </View>
                        <View className="w-1/12">
                            <Pressable onPress={handleDonePress} className="h-full" style={[styles.inputBox, { backgroundColor: isDone ? "#FFF" : "#00000080" }]} />
                        </View>
                    </View>
                </Animated.View>
            </SwipeableItem>
        </View>
    )
}

export default SerieRow;

const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: "#00000080",
        borderColor: "#000000CC",
        borderWidth: 1,
        color: "white",
        fontSize: 12,
        width: '100%',
        textAlign: 'center',
        fontFamily: "Roboto_400Regular",
        paddingVertical: 4,
    },
    previousReps: {
        fontFamily: "Roboto_400Regular",
        fontSize: 12,
        color: 'white',
        paddingVertical: 4,
    },
    itemCopy: {
        color: "white",
        fontFamily: "Roboto_700Bold",
        fontSize: 12,
    },
});