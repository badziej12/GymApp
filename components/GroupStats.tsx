import { FC } from "react";
import { View, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

type GroupStatProps = {
    username: string | undefined;
}

export const GroupStat:FC<GroupStatProps> = ({username}) => {

    return (
        <View className='flex-grow'>
            <View className='border-black border-2 border-b-8 flex-col items-center justify-center h-32 bg-amber-300 rounded-xl'>
                <Text className='text-black uppercase mb-4' style={{fontWeight: "bold", fontSize: hp(2)}}>Top 1</Text>
                <Text className='text-black uppercase' style={{fontWeight: "bold", fontSize: hp(2)}}>{username}</Text>
            </View>
        </View>
    );
}