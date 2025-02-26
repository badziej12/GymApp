import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { ProfileCard } from '@/components/ProfileCard';
import { Callendar } from '@/components/Callendar';

export default function Home() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleSignOut = async () => {
    await logout();
  }

  return (
    <View className="flex-1 bg-white ">
      <View>
        <Callendar />
      </View>
      <View className='px-5 flex-1'>
        <View className="flex-1">
          <View className="mb-5">
            <ProfileCard />
          </View>
        </View>
        <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
          <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
            <Text className="text-white font-bold tracking-wider text-center">Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}