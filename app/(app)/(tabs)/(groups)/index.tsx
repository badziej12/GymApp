import { Pressable, View, Text } from "react-native"
import { Post } from '@/components/Post';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { router } from "expo-router";

export default function Groups() {

    return (
        <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
            <View className="flex-1">
                <Text>GRUPY</Text>
            </View>
        </View>
    );
}