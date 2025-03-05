import { useGroups } from "@/context/groupsContext";
import { groupsRef, usersRef } from "@/firebaseConfig";
import { Link, router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useRef } from "react";
import { View, Text, SafeAreaView, Pressable, StyleSheet, TextInput, Alert } from "react-native";
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function AddMember() {
    const { id } = useLocalSearchParams();
    const { addGroupMember } = useGroups();
    const isPresented = router.canGoBack();
    const userNameRef = useRef("");

    const handleAddGroupMember = () => {
        console.log("ID grupy", id);
        if (!userNameRef.current) {
            Alert.alert("Uzupełnij nazwe uzytkownika");
            return;
        }
        console.log("Dodawanie uzytkownika");
        addGroupMember(userNameRef.current);
        router.dismiss();
    }

    return (
        <SafeAreaView className="flex-1 h-full">
            <View className="pt-10 flex-col h-full">
                <View className="border-b-2 px-5 pb-4">
                    <Text style={styles.inputLabel}>Dodaj członka</Text>
                </View>
                <View className="px-5 my-9">
                    <View  style={{ height: hp(7) }}
                        className="flex-row gap-4 px-6 bg-neutral-200 items-center rounded-2xl">
                        <TextInput
                            onChangeText={value => userNameRef.current = value}
                            style={{ fontSize: hp(2) }}
                            className="flex-1 font-semibold text-neutral-700"
                            autoCorrect={false}
                            placeholder="Nazwa uzytkownika"
                            placeholderTextColor={'gray'}/>
                    </View>
                </View>
                <View className="flex-col px-5 pt-4 border-t-2"> 
                    <Pressable onPress={handleAddGroupMember} className="bg-indigo-400 items-center rounded-xl py-4 mb-6 border-2">
                        <Text style={styles.buttonText}>Dodaj uzytkownika</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    inputLabel: {
        fontSize: hp(2),
        fontWeight: "bold",
    },
    selectArrow: {
        position: "absolute",
        right: "5%"
    },
    buttonText: {
        fontSize: hp(1.8),
        color: "white",
        fontWeight: "medium",
    },
    removeButton: {
        aspectRatio: "1/1",
    },
})