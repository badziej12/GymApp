import { Pressable, View, Text, ScrollView } from "react-native"
import { Post } from '@/components/Post';
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { db } from "@/firebaseConfig";
import { router } from "expo-router";

export default function Posts() {
    const [posts, setPosts] = useState<{ title: string; description: string; author: string }[]>([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
            const postsArray: { title: string; description: string; author: string }[] = [];
            snapshot.docs.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
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

    return (
        <View className="flex-1 bg-white">
            <ScrollView style={{paddingTop: 40}} className="flex-1 px-5">
                <View className="flex-col gap-5">
                    {posts.map((post, index) => {
                        return <Post key={index} postTitle={post.title} postCopy={post.description} author={post.author} />
                    })}
                </View>
            </ScrollView>
            <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
                <Pressable onPress={() => router.push("/createPost")} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
                    <Text className="text-white font-bold tracking-wider text-center">Add new</Text>
                </Pressable>
            </View>
        </View>
    );
}