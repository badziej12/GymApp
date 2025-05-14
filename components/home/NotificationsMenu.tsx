import { View, Text, Pressable } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const NotificationsMenu = () => {
    return (
        <View className='flex flex-row w-full py-1 px-2 mb-2 text-white justify-between items-center' style={{ backgroundColor: '#BF9900' }}>
            <Text className='text-white' style={{ fontSize: hp(1.6), fontFamily: "Inter_500Medium" }}>Powiadomienia</Text>
            <Pressable>
                <View className="h-4 aspect-square bg-background-300">

                </View>
            </Pressable>
        </View>
    )
}