import { View, Text, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useAuth } from '@/context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, doc, getDocs } from 'firebase/firestore';
import { usersRef } from '@/firebaseConfig';
import { useDate } from '@/context/dateContext';
import { addDays, startOfWeek } from 'date-fns';
import { FullExerciseRefType, SeriesType } from '../(tabs)/(addTraining)/index';
import { HeroComponent } from '@/components/HeroComponent';
import { UserStats } from '@/components/UserStats';
import { NotificationsMenu } from '@/components/NotificationsMenu';

export default function Home() {
  const router = useRouter();
  const [ trainingsWeekNumber, setTrainingsWeekNumber ] = useState(0);
  const [ trainingsTotalNumber, setTrainingsTotalNumber ] = useState(0);
  const [ totalWeight, setTotalWeight ] = useState(0);
  const { logout, user } = useAuth();
  const { selectedDate } = useDate();
      
    const fetchUserTrainings = async () => {
        if (user?.userId) {
            const userRef = doc(usersRef, user?.userId);
            const userTrainingsRef = collection(userRef, "trainings");

            const querySnapshot = await getDocs(userTrainingsRef);

            const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i).toDateString());

            let weekTrainings = 0;
            let sumTotalWeight: number = 0;

            querySnapshot.forEach((doc) => {
              const dateString = doc.data().date;
              const exercises = doc.data().exercises;

              exercises.forEach((exercise: FullExerciseRefType) => {
                exercise.series.forEach((serie: SeriesType) => {
                  const reps = parseInt(serie.reps);
                  const weight = parseInt(serie.weight);
                  sumTotalWeight += reps * weight;
                })
              })
              
              if (daysOfWeek.includes(dateString)) {
                weekTrainings++;
              }
            })

            setTrainingsTotalNumber(querySnapshot.docs.length);
            setTrainingsWeekNumber(weekTrainings);
            setTotalWeight(sumTotalWeight);
        }
    }
  
    useFocusEffect(
        useCallback(() => {
            fetchUserTrainings();
        }, [user, selectedDate])
    );

  const handleSignOut = async () => {
    await logout();
  }

  return (
    <View className="flex-1 bg-white flex-col">
      <View>
        <HeroComponent />
      </View>
      <View className='px-5 flex-1 bg-primary'>
        <View className="py-5">
          {/* Notifications component */}
          <NotificationsMenu />
          <UserStats>

          </UserStats>
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