import { FontAwesome } from '@expo/vector-icons';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import ExerciseDetails from './ExerciseDetails';
import { FullExerciseRefType, SeriesType } from '@/app/(app)/addTraining';


type ExerciseSelectProps = {
    trainings: string[];
    onRemove: () => void;
}

export const ExerciseSelect = forwardRef<{ getExercise: () => FullExerciseRefType | null }, ExerciseSelectProps>(({ trainings, onRemove }, ref) => {
    const [selectedTraining, setSelectedTraining] = useState('');
    const fullExerciseRef = useRef<FullExerciseRefType | null>(null);
    const exerciseDetailsRef = useRef<{ getReps: () => string[], getWeights: () => string[] } | null>(null);

    useImperativeHandle(ref, () => ({
        getExercise: () => showRef()
    }));

    const showRef = () => {
        if (exerciseDetailsRef.current) {
            const reps = exerciseDetailsRef.current.getReps();
            const weights = exerciseDetailsRef.current.getWeights();

            const series: SeriesType[] = [];

            for (let i = 0; i < reps.length; i++) {
                if (weights[i] && reps[i]) {
                    series.push({ reps: reps[i], weight: weights[i] });
                }
            }

            if (series.length > 0) {
                fullExerciseRef.current = {
                    exerciseName: selectedTraining,
                    series: series
                };
            }

            return fullExerciseRef.current;
        } else {
            return null;
        }
    };

    return (
        <View className='flex-col mb-10'>
            <View className="flex-row mb-4">
                <SelectDropdown
                    data={trainings}
                    onSelect={(selectedItem, index) => {
                        setSelectedTraining(selectedItem);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View className="relative bg-blue-400 rounded-xl items-center py-4 flex-row justify-center border-2 flex-grow">
                                <Text className="font-medium">
                                    {(selectedItem && selectedItem) || 'Wybierz ćwiczenie'}
                                </Text>
                                <FontAwesome style={styles.selectArrow} size={28} name={isOpened ? "angle-up" : "angle-down"} color={"black"} />
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View className="bg-slate-300 items-center py-4">
                                <Text>{item}</Text>
                            </View>
                        )
                    }}
                />
                <Pressable onPress={onRemove} className="ml-3 bg-red-600 px-3 rounded-xl justify-center">
                    <FontAwesome size={28} name={"remove"} color={"white"} />
                </Pressable>
            </View>
            {selectedTraining && <ExerciseDetails ref={exerciseDetailsRef} />}
        </View>
    );
});

const styles = StyleSheet.create({
    selectArrow: {
        position: "absolute",
        right: "5%"
    },
})