import { View, Text, Button, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore"
import { useAuth } from '@/context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { Post } from '@/components/Post';
import { db } from '@/firebaseConfig';

export default function Home() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [posts, setPosts] = useState<{ title: string; description: string; author: string }[]>([]);

  const handleSignOut = async () => {
    await logout();
  }

  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postsArray: { title: string; description: string; author: string }[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      postsArray.push({
        title: doc.data().title,
        description: doc.data().description,
        author: "autor",
      })
    });
    setPosts(postsArray);
  }

  useEffect(() => {
    getPosts();
  }, []);

  console.log("To user: ", user);
  console.log(posts);
  return (
    <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
      <View className="flex-1">
        <View className="mb-5">
          <Text className="font-semibold" style={{fontSize: hp(3)}}>Witaj {user?.username}!</Text>
        </View>
        <View className="flex-col gap-5">
          {posts.map((post) => {
            return <Post postTitle={post.title} postCopy={post.description} author={post.author} />
          })}
        </View>
      </View>
      <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
        <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Sign Out</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/createPost")} style={{height: hp(6.5)}} className="bg-indigo-300 flex-grow rounded-xl justify-center">
          <Text className="text-white font-bold tracking-wider text-center">Add new</Text>
        </Pressable>
      </View>
    </View>
  )
}