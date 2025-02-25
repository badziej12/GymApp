import { Pressable, View, Text } from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { router } from "expo-router";

export default function Groups() {

    return (
        <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
            <View className="flex-1">
                <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
                    <Pressable onPress={() => router.push("/createGroup")} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
                        <Text className="text-white font-bold tracking-wider text-center">Create</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}