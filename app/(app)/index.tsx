import { View, Text, Button, Pressable } from 'react-native';
import { useAuth } from '@/context/authContext';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Home() {
  const { logout, user } = useAuth();
  const handleSignOut = async () => {
    await logout();
  }

  console.log("To user: ", user);
  return (
    <View style={{paddingTop: 40}} className="bg-red-200">
      <Text>Home i cos</Text>
      <Text>Siema {user?.username}</Text>
      <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-500 rounded-xl justify-center">
        <Text className="text-white font-bold tracking-wider text-center">Sign Out</Text>
      </Pressable>
    </View>
  )
}