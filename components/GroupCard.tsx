import { Link, router } from "expo-router";
import { FC } from "react";
import { View, Text, Pressable } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

type GroupCardProps = {
    name: string;
    members: string[];
    groupSize: number;
    groupId: string;
}

export const GroupCard: FC<GroupCardProps> = ({name, members, groupSize, groupId}) => {

    return (
        <Pressable onPress={() => router.push(`/groups/${groupId}`)} className="flex-col">
            <View className="bg-slate-400 px-4 py-6 rounded-3xl">
                <Text className={"color-white font-semibold"} style={{fontSize: hp(2)}}>{name}</Text>
            </View>
            <View className="px-4 py-6 border-x-2 border-b-2 rounded-3xl">
                <View className="flex-col">
                    {members.map(memberName => 
                        <Text key={memberName} className={"color-black mb-2"} style={{fontSize: hp(1.5)}}>{memberName}</Text>
                    )}
                    <Text className={"color-black mt-2"} style={{fontSize: hp(1)}}>Członkowie: {groupSize}</Text>
                </View>
            </View>
        </Pressable>
    );
}