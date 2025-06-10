import { FC } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import SwipeableItem from 'react-native-swipeable-item';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SerieRowType } from "@/app/(app)/addTraining";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { exerciseActions } from "@/store/exercise/exercise-slice";

type SerieRowProps = {
    onRemoveSerieSelect: (id: number) => void;
    serie: SerieRowType;
    exerciseId: number;
    index: number;
}

const SerieRow: FC<SerieRowProps> = ({ onRemoveSerieSelect, exerciseId, index }) => {
    const serie = useAppSelector(state => state.exercise.exercises[exerciseId].series[index]);
    const dispatch = useAppDispatch();

    const handleDonePress = () => {
        dispatch(exerciseActions.updateSerieRow({
            exerciseId,
            index,
            serie: {
                ...serie,
                isDone: !serie.isDone,
                isDoneError: false,
            }
        }))
    }

    const handleChangeText = (stateName: "reps" | "weight", value: string) => {
        dispatch(exerciseActions.updateSerieRow({
            exerciseId,
            index,
            serie: {
                ...serie,
                [stateName + "Error"]: false,
                [stateName]: value,
            }
        }))
    }

    let previousResult;

    if (serie.previousWeight && serie.previousWeight) {
        previousResult = `${serie.previousWeight}kg x ${serie.previousReps}`;
    } else {
        previousResult = '-'
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
                            <Text style={styles.previousReps}>{previousResult}</Text>
                        </View>
                        <View className="w-2/12">
                            <TextInput
                                style={[styles.inputBox, { backgroundColor: serie.weightError ? "red" : "#00000080" }]}
                                inputMode={"numeric"}
                                className="flex-1 px-4 text-center"
                                onChangeText={(val) => {
                                    handleChangeText("weight", val);
                                }}
                                value={serie.weight}
                            />
                        </View>
                        <View className="w-2/12">
                            <TextInput
                                style={[styles.inputBox, , { backgroundColor: serie.repsError ? "red" : "#00000080" }]}
                                inputMode={"numeric"}
                                className="flex-1 text-center"
                                placeholderTextColor={"black"}
                                onChangeText={(val) => {
                                    handleChangeText("reps", val);
                                }}
                                value={serie.reps}
                            />
                        </View>
                        <View className="w-1/12">
                            <Pressable onPress={handleDonePress} className="h-full" style={[styles.inputBox, { backgroundColor: serie.isDone ? "#FFF" : "#00000080", borderColor: serie.isDoneError ? "red" : "#000000CC" }]} />
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