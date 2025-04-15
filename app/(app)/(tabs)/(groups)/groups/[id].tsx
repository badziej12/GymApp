import { GroupStat } from "@/components/GroupStats";
import { useGroups } from "@/context/groupsContext";
import { router, useLocalSearchParams } from "expo-router";
import { DocumentData } from "firebase/firestore";
import { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function GroupScreen() {
    const { id } = useLocalSearchParams<{id: string, name: string, members: string, groupSize: string}>();
    const { group, fetchGroupData, getTrainingsByExercise, bestScoreMember } = useGroups();

    useEffect(() => {
        const getGroupData = async () => {
            await fetchGroupData(id);
        };

        getGroupData();
    }, []);

    useEffect(() => {
        const getBestScoreMember = async () => {
            if (group) {
                await getTrainingsByExercise("Martwy ciąg");
            }
        }

        getBestScoreMember();
    }, [group]);

    return (
        <SafeAreaView className="flex-1 h-full">
            <View className="flex-col h-full">
                <View className="border-b-2 px-5 pb-4">
                    <Text>{group?.name}</Text>
                </View>
                <ScrollView className="flex-col px-5 pt-4">
                    <GroupStat username={bestScoreMember?.username} />
                </ScrollView>
                <View className="flex-col px-5 pt-4 border-t-2">
                    <Pressable onPress={() => router.push({ pathname: '/groups/addMember', params: { id: id }})} className="bg-indigo-400 items-center rounded-xl py-4 mb-6 border-2">
                        <Text>Dodaj członka</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}