import { Text, View } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

type Props = {
  postTitle: string;
  postCopy: string;
  author: string;
}

export const Post:React.FC<Props> = ({postTitle, postCopy, author}) => {

  return (
    <View className="flex-col justify-between px-6 bg-neutral-100 py-5 rounded-3xl shadow">
      <View className="">
        <Text className="font-bold color-black mb-3" style={{fontSize: hp(3)}}>
          {postTitle}
        </Text>
        <Text className="font-light color-black" style={{fontSize: hp(2)}}>
          {postCopy}
        </Text>
        <View className="bg-neutral-500 my-4" style={{height: 1}} />
        <Text className="font-medium text-right color-black" style={{fontSize: hp(2)}}>
          {author}
        </Text>
      </View>
    </View>
  )
}