import { FC } from "react"
import { Pressable, StyleSheet, View, Text } from "react-native"

type ButtonProps = {
    title: string,
    variant?: 'primary' | 'secondary' | 'dashed',
    onPress?: () => void;
}

export const ButtonComponent: FC<ButtonProps> = ({ title, variant = "primary", onPress }) => {
    return (
        <Pressable onPress={onPress} className="text-center relative flex-row items-center justify-center flex-grow" style={styles[variant]}>
            {variant === "dashed" && (
                <View className="w-1/6" style={styles.buttonLine} />
            )}
            <Text className="text-center uppercase relative z-10 mx-2" style={styles[`${variant}Text`]}>{title}</Text>
            {variant === "dashed" && (
                <View className="w-1/6" style={styles.buttonLine} />
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    primary: {
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E3B600",
        backgroundColor: "#FFD500",
    },
    primaryText: {
        color: "#000",
        fontFamily: "Montserrat_700Bold_Italic",
    },
    secondary: {
        paddingVertical: 12,
        borderWidth: 3,
        borderColor: "#FFF",
        fontStyle: 'italic',
    },
    secondaryText: {
        color: "#FFF",
        fontStyle: 'italic',
        fontFamily: "Montserrat_700Bold_Italic",
    },
    dashed: {
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#E3E3E3",
    },
    dashedText: {
        color: "#FFD500",
        fontStyle: 'italic',
        backdropFilter: '',
        fontFamily: "Montserrat_700Bold_Italic",
    },
    buttonLine: {
        height: 1,
        backgroundColor: "#E3E3E3",
    },
})