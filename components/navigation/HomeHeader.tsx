import { Platform, Pressable, Text, View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_100Thin } from '@expo-google-fonts/inter/100Thin';
import { HamburgerMenu } from '../HamburgerMenu';


const ios = Platform.OS == 'ios';

type Props = {
  userName: string | undefined,
}

export const HomeHeader: React.FC<Props> = ({ userName }) => {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_400Regular,
  });
  const { top } = useSafeAreaInsets();

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={{ paddingTop: ios ? top : top + 10 }} className="w-full bg-primary flex">
        <View className='flex-row justify-between items-center py-4 px-5'>
          <View>
            <Pressable className='w-10 h-10 bg-slate-300 rounded-full' />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: hp(2) }} className="color-black">
            {userName}
          </Text>
          <View>
            <HamburgerMenu />
          </View>
        </View>
      </View>
    )
  }
}