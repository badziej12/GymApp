import { useAuth } from "@/context/authContext";
import { useGroups } from "@/context/groupsContext";
import { router } from "expo-router";
import { useRef } from "react";
import { Pressable, SafeAreaView, TextInput, View, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function CreateGroup() {
    const { createGroup } = useGroups();
    const { user } = useAuth();

    const groupName = useRef("");

    const handleCreateGroup = () => {
        if (user?.userId) {
            createGroup(groupName.current, user.userId);
            router.dismiss(1);
        }
    }
    
    return (
        <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
            <View className="flex-1">
            <View className="mb-5">
                <Text className="font-semibold" style={{fontSize: hp(3)}}>Stwórz grupę</Text>
            </View>
            <SafeAreaView className="flex-1 flex-col gap-4">
                <TextInput
                style={{fontSize: hp(2)}}
                className="bg-neutral-100 px-6 py-5 rounded-xl border-2"
                placeholder="Nazwa grupy"
                placeholderTextColor="grey"
                onChangeText={value => groupName.current = value}
                />
            </SafeAreaView>
            </View>
    
            <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
            <Pressable onPress={() => router.dismiss(1)} style={{height: hp(6.5)}} className="bg-indigo-300 flex-grow rounded-xl justify-center">
                <Text className="text-white font-bold tracking-wider text-center">Go back</Text>
            </Pressable>
            <Pressable onPress={handleCreateGroup} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
                <Text className="text-white font-bold tracking-wider text-center">Create</Text>
            </Pressable>
            </View>
        </View>
    );
}