import { FC, Ref, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Vibration } from "react-native";
import SwipeableItem from 'react-native-swipeable-item';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SerieRowType } from "@/app/(app)/addTraining";

type SerieRowRefType = {
    getSerie: (toFinish?: boolean) => SerieRowType;
}

type SerieRowProps = {
    onRemoveSerieSelect: (id: number) => void;
    serie: SerieRowType;
    index: number;
    ref: Ref<SerieRowRefType>;
}

const SerieRow: FC<SerieRowProps> = ({ onRemoveSerieSelect, serie, index, ref }) => {
    const [isDone, setIsDone] = useState(false);
    const [isEmpty, setIsEmpty] = useState({ reps: false, weight: false, isDone: false });
    const [weightValue, setWeightValue] = useState(serie.weight);
    const [repsValue, setRepsValue] = useState(serie.reps);

    const handleDonePress = () => {
        setIsDone(prev => {
            !prev && Vibration.vibrate();
            return !prev;
        });

        if (isEmpty.isDone) {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    isDone: false,
                }
            })
        }
    }

    const handleChangeText = (stateName: "reps" | "weight") => {
        if (isEmpty[stateName]) {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    [stateName]: false,
                }
            })
        }
    }

    useImperativeHandle(ref, () => ({
        getSerie: (toFinish?: boolean) => getSerie(toFinish)
    }));

    const getSerie = (toFinish = false) => {
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

        if (toFinish && !isDone) {
            setIsEmpty(prev => {
                return {
                    ...prev,
                    isDone: true,
                }
            })
        }

        return { id: serie.id, reps: repsValue, weight: weightValue, isDone };
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
                        onRemoveSerieSelect(serie.id);
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
                                onChangeText={(val) => {
                                    setWeightValue(val);
                                    handleChangeText("weight");
                                }}
                                value={weightValue}
                            />
                        </View>
                        <View className="w-2/12">
                            <TextInput
                                style={[styles.inputBox, , { backgroundColor: isEmpty.reps ? "red" : "#00000080" }]}
                                inputMode={"numeric"}
                                className="flex-1 text-center"
                                placeholderTextColor={"black"}
                                onChangeText={(val) => {
                                    setRepsValue(val);
                                    handleChangeText("reps");
                                }}
                                value={repsValue}
                            />
                        </View>
                        <View className="w-1/12">
                            <Pressable onPress={handleDonePress} className="h-full" style={[styles.inputBox, { backgroundColor: isDone ? "#FFF" : "#00000080", borderColor: isEmpty.isDone ? "red" : "#000000CC" }]} />
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