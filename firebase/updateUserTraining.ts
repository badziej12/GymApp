import { usersRef } from "@/firebaseConfig";
import { ExtendedUser } from "@/store/auth/auth-slice";
import { CleanExerciseType } from "@/types";
import { addDoc, collection, doc } from "firebase/firestore";
import { Alert } from "react-native";

export const updateUserTraining = async (user: ExtendedUser | null, fullTraining: CleanExerciseType[], selectedDate: string) => {
    if (!user) {
        throw new Error("User is not defined");
    }
    const userRef = doc(usersRef, user.userId);
    const userTrainingsRef = collection(userRef, "trainings");

    try {
        await addDoc(userTrainingsRef, {
            date: selectedDate,
            exercises: fullTraining,
        })


    } catch (e: any) {
        console.error("Error adding document: ", e);

        let errorMessage = 'Error while adding new training';

        if (e instanceof Error) {
            errorMessage = e.message;
        }

        Alert.alert('Add training', errorMessage);
        throw e;
    }

}