import { FullExerciseRefType } from "@/app/(app)/addTraining";
import { usersRef } from "@/firebaseConfig";
import { ExtendedUser } from "@/store/auth/auth-slice";
import { addDoc, collection, doc } from "firebase/firestore";
import { Alert } from "react-native";

export const updateUserTraining = async (user: ExtendedUser, fullTraining: FullExerciseRefType[], selectedDate: string) => {
    const userRef = doc(usersRef, user?.userId);
    const userTrainingsRef = collection(userRef, "training");

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