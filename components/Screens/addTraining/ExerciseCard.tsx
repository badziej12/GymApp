import { FC } from "react"
import { Pressable, View, Text, StyleSheet } from "react-native"

type ExerciseCardProps = {
    exerciseName: string,
    exerciseCategory: string[],
    selectedExercises: string[],
    onSelectedExercise: (name: string) => void
}

const ExerciseCard: FC<ExerciseCardProps> = ({ exerciseName, exerciseCategory, selectedExercises, onSelectedExercise }) => {
    const isSelected = selectedExercises.includes(exerciseName);

    return (
        <Pressable onPress={() => onSelectedExercise(exerciseName)} className="flex-row mb-4">
            <View className="bg-white w-12 h-full">

            </View>
            <View className={`border-2 border-l-0 ${isSelected ? 'border-sunny' : 'border-white'} flex-grow flex-row`}>
                <View className="px-4 py-2 flex-col justify-center items-start flex-grow">
                    <Text style={styles.exerciseName} className={`text-${isSelected ? 'sunny' : 'white'} mb-1`}>{exerciseName}</Text>
                    <View className="flex-row gap-1">
                        {exerciseCategory.map(category => (
                            <Text key={category} style={styles.exerciseCategory} className={`text-${isSelected ? 'sunny' : 'white'}`}>{category}</Text>
                        ))}
                    </View>
                </View>
                <View className="w-12 flex-row items-center justify-center"><Text className={`text-${isSelected ? 'sunny' : 'white'}`} style={styles.icon}>?</Text></View>
            </View>
        </Pressable>
    )
}

export default ExerciseCard;

const styles = StyleSheet.create({
    exerciseName: {
        fontFamily: "Rubik_600SemiBold_Italic",
    },
    exerciseCategory: {
        fontFamily: "Rubik_400Regular",
        fontSize: 10,
    },
    icon: {
        fontFamily: "Rubik_600SemiBold_Italic",
        fontSize: 16,
    }
})