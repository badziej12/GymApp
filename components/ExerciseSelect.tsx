import { FontAwesome } from '@expo/vector-icons';
import { FC, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { ExerciseDetails } from './ExerciseDetails';

type ExerciseSelectProps = {
    trainings: string[];
    onRemove: () => void;
}

export const ExerciseSelect: FC<ExerciseSelectProps> = ({trainings, onRemove}) => {
    const [selectedTraining, setSelectedTraining] = useState('');

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
                            <View className="relative bg-slate-300 rounded-xl items-center py-4 flex-row justify-center border-2 flex-grow">
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
            {selectedTraining && <ExerciseDetails />}
        </View>
    );   
}

const styles = StyleSheet.create({
    selectArrow: {
        position: "absolute",
        right: "5%"
    },
})