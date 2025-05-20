import { FC } from "react";
import { TextInput, View, StyleSheet } from "react-native";

type SearchComponentProps = {
    searchText: string;
    onSearchChange: (value: string) => void;
}

const SearchComponent: FC<SearchComponentProps> = ({ searchText, onSearchChange }) => {
    return (
        <View className="mb-4">
            <TextInput
                className="outline-none"
                style={styles.inputStyles}
                value={searchText}
                onChangeText={onSearchChange}
                placeholder="Search"
            />
        </View>
    )
}

export default SearchComponent;

const styles = StyleSheet.create({
    inputStyles: {
        fontFamily: "Rubik_600SemiBold_Italic",
        backgroundColor: "#636363",
        borderWidth: 1,
        borderColor: "#FFF",
        padding: 8,
    }
})