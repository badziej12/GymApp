import { View, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const StatsCard = () => {

    return (
        <View className='flex-row w-1/2'>
            <View className="flex-row grow p-2">
                <View className='w-1/2 aspect-square' style={{backgroundColor: '#2C1212'}}>
                
                </View>
                <View className="w-1/2 p-3" style={{backgroundColor: '#696969'}}>
                    <Text className='text-black uppercase mb-4' style={{fontWeight: "bold", fontSize: hp(2)}}>130/</Text>
                    <Text className='text-black uppercase' style={{fontWeight: "bold", fontSize: hp(2)}}>100</Text>
                </View>
            </View>
            
        </View>
    )
}