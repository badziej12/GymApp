import { View, Text, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, doc, getDocs } from 'firebase/firestore';
import { usersRef } from '@/firebaseConfig';
import { addDays, startOfWeek } from 'date-fns';
import { HeroComponent } from '@/components/home/HeroComponent';
import { UserStats } from '@/components/UserStats';
import { NotificationsMenu } from '@/components/home/NotificationsMenu';
import { useAppSelector } from '@/store/store';

export default function Home() {
  const router = useRouter();
  const [trainingsWeekNumber, setTrainingsWeekNumber] = useState(0);
  const [trainingsTotalNumber, setTrainingsTotalNumber] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const user = useAppSelector(state => state.auth.user);
  // const selectedDateString = useAppSelector(state => state.date.selectedDate);
  const userData = useAppSelector(state => state.auth.user);

  // const selectedDate = new Date(selectedDateString);

  // const fetchUserTrainings = async () => {
  //   if (user?.userId) {
  //     const userRef = doc(usersRef, user?.userId);
  //     const userTrainingsRef = collection(userRef, "trainings");

  //     const querySnapshot = await getDocs(userTrainingsRef);

  //     const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  //     const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i).toDateString());

  //     let weekTrainings = 0;
  //     let sumTotalWeight: number = 0;

  //     querySnapshot.forEach((doc) => {
  //       const dateString = doc.data().date;
  //       const exercises = doc.data().exercises;

  //       exercises.forEach((exercise: FullExerciseRefType) => {
  //         exercise.series.forEach((serie: SeriesType) => {
  //           const reps = parseInt(serie.reps);
  //           const weight = parseInt(serie.weight);
  //           sumTotalWeight += reps * weight;
  //         })
  //       })

  //       if (daysOfWeek.includes(dateString)) {
  //         weekTrainings++;
  //       }
  //     })

  //     setTrainingsTotalNumber(querySnapshot.docs.length);
  //     setTrainingsWeekNumber(weekTrainings);
  //     setTotalWeight(sumTotalWeight);
  //   }
  // }

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchUserTrainings();
  //   }, [user, selectedDate])
  // );

  return (
    <View className="flex-1 bg-white flex-col">
      <View className='flex-1'>
        <HeroComponent />
      </View>
      <View className='px-5 flex-col bg-primary'>
        <View className="py-5">
          {/* Notifications component */}
          <NotificationsMenu />
          <UserStats>

          </UserStats>
        </View>
        {/* <View className="px-5 flex-row gap-2.5" style={{marginBottom: hp(5)}}>
          <Pressable onPress={handleSignOut} style={{height: hp(6.5)}} className="bg-indigo-500 flex-grow rounded-xl justify-center">
            <Text className="text-white font-bold tracking-wider text-center">Sign Out</Text>
          </Pressable>
        </View> */}
      </View>
    </View>
  )
}