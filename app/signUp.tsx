import { View, Text, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '@/context/authContext';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();

  const emailRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert('Sign in', "Please fill all the fields");
      return;
    }
    let response = await signUp(emailRef.current, passwordRef.current, usernameRef.current);
    // login process
    // console.log("got result: ", response);
    if(!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
  }
  return (
    <CustomKeyboardView>
      <View className="flex-1">
        <StatusBar style="light" />
        <View style={{ paddingTop: hp(20), paddingHorizontal: wp(5) }}
              className="flex-1 gap-12">
          <Text style={{ fontSize: hp(4) }}
                className="font-bold tracking-wider text-center text-black">
            Sign Up
          </Text>
          <View className="gap-4">
            <View style={{ height: hp(7) }}
                  className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="mail"
                        size={hp(2.7)}
                        color="gray"/>
              <TextInput
                onChangeText={value => emailRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                inputMode={"email"}
                autoCorrect={false}
                placeholder="Email address"
                placeholderTextColor={'gray'}/>
            </View>
            <View style={{ height: hp(7) }}
                  className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="person"
                        size={hp(2.7)}
                        color="gray"/>
              <TextInput
                onChangeText={value => usernameRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Nickname"
                placeholderTextColor={'gray'}/>
            </View>
            <View style={{ height: hp(7) }}
                  className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="lock"
                        size={hp(2.7)}
                        color="gray"/>
              <TextInput
                onChangeText={value => passwordRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor={'gray'}/>
            </View>
          </View>

          <View className="gap-4">
            {/* Submit button */}
            <TouchableOpacity onPress={handleRegister}
                              style={{ height: hp(6.5) }}
                              className="bg-indigo-500 rounded-xl justify-center">
              <Text style={{ fontSize: hp(2.7) }}
                    className="text-white font-bold tracking-wider text-center">Sign Up</Text>
            </TouchableOpacity>

            {/* Sign up button */}
            <View className="flex-row justify-center">
              <Text style={{ fontSize: hp(1.8) }}
                    className="font-semibold text-neutral-500">Already have an account?</Text>
              <Pressable onPress={() => router.push('/signIn')}>
                <Text style={{ fontSize: hp(1.8) }}
                      className="font-bold text-indigo-500 ml-1">Sign in</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}