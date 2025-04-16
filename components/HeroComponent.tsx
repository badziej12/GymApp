import { View, StyleSheet } from "react-native";
import { Callendar } from "./Callendar";
import { LinearGradient } from "expo-linear-gradient";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const HeroComponent = () => {

    return (
        <View style={{height: hp(40)}} className="bg-scarlet-500 relative">
            <LinearGradient
                colors={['rgba(0,0,0, 0.3)', 'transparent']}
                style={styles.gradientBg}
            />
            <Callendar />
            <View style={styles.floorBg} className="bg-scarlet-400" />
        </View>   
    )
}

const styles = StyleSheet.create({
    gradientBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: hp(5),
    },
    floorBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: hp(10),
    }
})