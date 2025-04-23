import { View, StyleSheet, Image } from "react-native";
import { Callendar } from "./Callendar";
import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const HeroComponent = () => {

    return (
        <View className="bg-scarlet-500 relative grow">
            <LinearGradient
                colors={['rgba(0,0,0, 0.3)', 'transparent']}
                style={styles.gradientBg}
            />
            <Callendar />
            <Image style={styles.avatarImage} source={require('@/assets/images/hero-avatar.png')} />
            <View style={styles.floorBg} className="bg-scarlet-400 h-1/4 max-h-24" />
        </View >
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
        // height: hp(10),
    },
    avatarImage: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: '-50%' }],
        zIndex: 3,
        bottom: '7%',
        height: '60%',
        resizeMode: 'contain',
    }
})