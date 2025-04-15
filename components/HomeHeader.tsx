import { Platform, Text, View } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ios = Platform.OS == 'ios';

type Props = {
  userName: string | undefined,
}

export const HomeHeader:React.FC<Props> = ({userName}) => {

  const { top } = useSafeAreaInsets();

  return (
    <View style={{paddingTop: ios? top: top+10 }} className="w-full bg-primary">
      <Text className="font-bold color-white" style={{fontSize: hp(3)}}>
        {userName}
      </Text>
    </View>
  )
}