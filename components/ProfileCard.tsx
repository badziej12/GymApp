import { useAuth } from "@/context/authContext";
import { FC } from "react";
import { View, Text, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export const ProfileCard: FC = () => {
    const { user } = useAuth();

    return (
        <View className={"flex-col"}>
            <View className={"rounded-3xl bg-indigo-500 px-4 py-6"}>
                <View className="flex-row">
                    <Image source={require('@/assets/images/react-logo.png')} />
                    <Text className={"color-white font-bold"} style={{fontSize: hp(3)}}>{user?.username}</Text>
                </View>
            </View>
        </View>
    )
}