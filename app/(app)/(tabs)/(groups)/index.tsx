import { Pressable, View, Text, ScrollView } from "react-native"
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { GroupCard } from "@/components/GroupCard";
import { useAuth } from "@/context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { groupsRef, usersRef } from "@/firebaseConfig";

export default function Groups() {
    const [groups, setGroups] = useState<{ name: string; members: string[]; groupSize: number, groupId: string }[]>([]);

    const { user } = useAuth();
    
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
        <View className="flex-1 bg-white px-5">
            <View className="flex-1">
                <ScrollView style={{paddingTop: 40}} className="flex-1 px-5">
                    <View className="flex-col gap-5">
                        {groups.map(group => 
                            <GroupCard key={group.name} name={group.name} members={group.members} groupSize={group.groupSize} groupId={group.groupId} />
                        )}
                    </View>
                </ScrollView>
                <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
                    <Pressable onPress={() => router.push("/createGroup")} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
                        <Text className="text-white font-bold tracking-wider text-center">Create</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}