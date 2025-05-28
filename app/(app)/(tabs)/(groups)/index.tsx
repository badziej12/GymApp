import { Pressable, View, Text, ScrollView, StyleSheet } from "react-native"
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { GroupCard } from "@/components/GroupCard";
import { doc, getDoc } from "firebase/firestore";
import { groupsRef, usersRef } from "@/firebaseConfig";
import { useAppSelector } from "@/store/store";

export default function Groups() {
    const [groups, setGroups] = useState<{ name: string; members: string[]; groupSize: number, groupId: string }[]>([]);

    const user = useAppSelector(state => state.auth.user);

    const fetchUserGroups = async () => {
        if (user?.userId) {
            const userRef = doc(usersRef, user?.userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userGroups = userData.groups || [];

                const groupDetails = await Promise.all(userGroups.map(async (groupId: string) => {
                    const groupRef = doc(groupsRef, groupId);
                    const groupSnap = await getDoc(groupRef);

                    const groupName = groupSnap.get("name");
                    const groupSize = groupSnap.get("members").length;

                    const members = await Promise.all(groupSnap.get("members").map(async (memberId: string) => {
                        const memberRef = doc(usersRef, memberId);
                        const memberSnap = await getDoc(memberRef);

                        if (docSnap.exists()) {
                            return memberSnap.get("username");
                        }
                    }));

                    return groupSnap.exists() ? { name: groupName, groupSize: groupSize, members: members, groupId: groupId } : null;
                }));

                console.log(groupDetails);
                setGroups(groupDetails);
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserGroups();
        }, [user])
    );

    return (
        <View className="flex-1 bg-background-900">
            <LinearGradient
                colors={['rgba(0,0,0, 0.3)', 'transparent']}
                style={styles.gradientBg}
            />
            <View className="pt-12 mb-8">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-white px-5">Grupy do których należysz</Text>
                <ScrollView horizontal={true} style={{ paddingTop: 20 }} showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-5 px-5">
                        {groups.map(group =>
                            <GroupCard key={group.name} name={group.name} members={group.members} groupSize={group.groupSize} groupId={group.groupId} />
                        )}
                    </View>
                </ScrollView>
            </View>
            <View className="px-5 mb-8">
                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-white">Twoje najlepsze wyniki w grupie</Text>

            </View>
            <View className="flex-row gap-2.5 px-5" style={{ marginBottom: hp(5) }}>
                <Pressable onPress={() => router.push("/createGroup")} className="bg-background-300 justify-center py-3 px-6">
                    <Text style={{ fontFamily: "Inter_500Medium" }} className="text-center">Stwórz grupę</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gradientBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: hp(5),
    },
});