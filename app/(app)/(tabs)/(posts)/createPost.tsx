import { useRef } from 'react';
import { View, Text, Pressable, SafeAreaView, TextInput, Alert } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';
import { doc, setDoc } from '@firebase/firestore';
import { useAppSelector } from '@/store/store';

export default function CreatePost() {
  const user = useAppSelector(state => state.auth.user);
  const router = useRouter();

  const titleRef = useRef("");
  const descriptionRef = useRef("");


  const handleCreatePost = async () => {
    if (!titleRef.current || !descriptionRef.current) {
      Alert.alert('Create post', "Please fill all the fields");
      return;
    }
    let response = await createPost(titleRef.current, descriptionRef.current);
    // login process
    // console.log("got result: ", response);
    if (!response.success) {
      Alert.alert('Create Post', response.msg);
    }
    return router.dismiss(1);
  }


  const createPost = async (title: string, description: string) => {
    try {
      const docRef = doc(db, "posts", user?.userId + "_" + new Date().getTime());
      await setDoc(docRef, {
        title: title,
        description: description,
        author: user?.username,
        userId: user?.userId
      });
      return { success: true, title: title, description: description, userId: user?.userId };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email')) msg = 'Invalid email'
      if (msg.includes('(auth/email-already-in-use')) msg = 'This email is already in use'
      return { success: false, msg: msg }
    }
  }

  return (
    <View style={{ paddingTop: 40 }} className="flex-1 bg-white px-5">
      <View className="flex-1">
        <View className="mb-5">
          <Text className="font-semibold" style={{ fontSize: hp(3) }}>Stwórz post</Text>
        </View>
        <SafeAreaView className="flex-1 flex-col gap-4">
          <TextInput
            style={{ fontSize: hp(2) }}
            className="bg-neutral-100 px-6 py-5 rounded-xl border-2"
            placeholder="Title"
            placeholderTextColor="grey"
            onChangeText={value => titleRef.current = value}
          />
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={80}
            style={{ fontSize: hp(2), height: hp(40) }}
            placeholder="Description"
            placeholderTextColor="grey"
            className="bg-neutral-100 px-6 py-5 rounded-xl border-2"
            onChangeText={value => descriptionRef.current = value}
          />
        </SafeAreaView>
      </View>

      <View className="px-5 flex-row gap-2.5" style={{ marginBottom: hp(5) }}>
        <Pressable onPress={() => router.dismiss(1)} style={{ height: hp(6.5) }} className="bg-indigo-300 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Go back</Text>
        </Pressable>
        <Pressable onPress={handleCreatePost} style={{ height: hp(6.5) }} className="bg-indigo-500 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Create</Text>
        </Pressable>
      </View>
    </View>
  )
}