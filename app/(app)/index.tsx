import { View, Text, Button, Pressable } from 'react-native';
import { useAuth } from '@/context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Stack } from 'expo-router';
import HomeHeader from '@/components/HomeHeader';
import { Post } from '@/components/Post';

export default function Home() {
  const { logout, user } = useAuth();
  const handleSignOut = async () => {
    await logout();
  }

  console.log("To user: ", user);
  return (
    <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
      <Stack.Screen
        options={{
          header: () => <HomeHeader />
        }}
      />
      <View className="flex-1">
        <View className="mb-5">
          <Text className="font-semibold" style={{fontSize: hp(3)}}>Witaj {user?.username}!</Text>
        </View>
        <Post postTitle="Tytuł posta" postCopy="Jakiś tekst" author="Autor" />
      </View>
      <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
        <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Sign Out</Text>
        </Pressable>
        <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-300 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Add new</Text>
        </Pressable>
      </View>
    </View>
  )
}