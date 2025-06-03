import { FC } from "react"
import { Pressable, View, Text, StyleSheet } from "react-native"

type TrainingCardProps = {
    trainingName: string,
    trainingCategory: string[],
    selectedTrainings: string[],
    onSelectTraining: (name: string) => void
}

const TrainingCard: FC<TrainingCardProps> = ({ trainingName, trainingCategory, selectedTrainings, onSelectTraining }) => {
    const isSelected = selectedTrainings.includes(trainingName);

    return (
        <Pressable onPress={() => onSelectTraining(trainingName)} className="flex-row mb-4">
            <View className="bg-white w-12 h-full">

            </View>
            <View className={`border-2 border-l-0 ${isSelected ? 'border-sunny' : 'border-white'} flex-grow flex-row`}>
                <View className="px-4 py-2 flex-col justify-center items-start flex-grow">
                    <Text style={styles.trainingName} className={`text-${isSelected ? 'sunny' : 'white'} mb-1`}>{trainingName}</Text>
                    <View className="flex-row gap-1">
                        {trainingCategory.map(category => (
                            <Text key={category} style={styles.trainingCategory} className={`text-${isSelected ? 'sunny' : 'white'}`}>{category}</Text>
                        ))}
                    </View>
                </View>
                <View className="w-12 flex-row items-center justify-center"><Text className={`text-${isSelected ? 'sunny' : 'white'}`} style={styles.icon}>?</Text></View>
            </View>
        </Pressable>
    )
}

export default TrainingCard;

const styles = StyleSheet.create({
    trainingName: {
        fontFamily: "Rubik_600SemiBold_Italic",
    },
    trainingCategory: {
        fontFamily: "Rubik_400Regular",
        fontSize: 10,
    },
    icon: {
        fontFamily: "Rubik_600SemiBold_Italic",
        fontSize: 16,
    }
})