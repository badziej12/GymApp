import { View, Text, Button, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore"
import { useAuth } from '@/context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { Post } from '@/components/Post';
import { db } from '@/firebaseConfig';
import { ProfileCard } from '@/components/ProfileCard';

export default function Home() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [posts, setPosts] = useState<{ title: string; description: string; author: string }[]>([]);

  const handleSignOut = async () => {
    await logout();
  }


  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsArray: { title: string; description: string; author: string }[] = [];
      snapshot.docs.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        postsArray.push({
          title: doc.data().title,
          description: doc.data().description,
          author: doc.data().author,
        });
      })
      setPosts(postsArray);
    });

    return () => unsub();
  }, []);

  console.log("To user: ", user);
  console.log(posts);
  return (
    <View style={{paddingTop: 40}} className="flex-1 bg-white px-5">
      <View className="flex-1">
        <View className="mb-5">
          <ProfileCard />
        </View>
        <View className="flex-col gap-5">
          {posts.map((post, index) => {
            return <Post key={index} postTitle={post.title} postCopy={post.description} author={post.author} />
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