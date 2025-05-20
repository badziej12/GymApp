import { FC } from "react"
import { Pressable, View, Text, StyleSheet } from "react-native"

type TrainingCardProps = {
    trainingName: string,
    selectedTraining: string,
    onSelectTraining: (name: string) => void
}

const TrainingCard: FC<TrainingCardProps> = ({ trainingName, selectedTraining, onSelectTraining }) => {
    const isSelected = trainingName === selectedTraining;

    return (
        <Pressable onPress={() => onSelectTraining(trainingName)} className="h-12 flex-row mb-4">
            <View className="bg-white w-12 h-full">

            </View>
            <View className={`border-2 border-l-0 border-${isSelected ? 'sunny' : 'white'} flex-grow flex-row`}>
                <View className="px-4 py-2 flex-row items-center flex-grow">
                    <Text style={styles.trainingName} className={`text-${isSelected ? 'sunny' : 'white'}`}>{trainingName}</Text>
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
    icon: {
        fontFamily: "Rubik_600SemiBold_Italic",
        fontSize: 16,
    }
})