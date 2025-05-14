import { router } from "expo-router";
import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type GroupCardProps = {
    name: string;
    members: string[];
    groupSize: number;
    groupId: string;
}

export const GroupCard: FC<GroupCardProps> = ({ name, members, groupSize, groupId }) => {
    return (
        <Pressable onPress={() => router.push(`/groups/${groupId}`)} className="flex-col bg-scarlet-200" style={{ width: wp(40) }}>
            <View className="px-4" style={{ backgroundColor: 'rgba(217, 217, 217, 0.4)' }}>
                <Text className={"font-semibold text-center"} style={{ fontSize: hp(2.8), fontFamily: 'Inter_700Bold', lineHeight: 48 }}>{name}</Text>
            </View>
            <View className="px-4 py-6 rounded-3xl">
                <View className="flex-col">
                    {members.map(memberName =>
                        <Text key={memberName} className={"color-black mb-2"} style={{ fontSize: hp(1.5) }}>{memberName}</Text>
                    )}
                    <Text className={"color-black mt-2"} style={{ fontSize: hp(1) }}>Członkowie: {groupSize}</Text>
                </View>
            </View>
        </Pressable>
    );
}