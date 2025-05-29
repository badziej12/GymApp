import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { authActions, ExtendedUser } from "../auth-slice";
import { AppDispach } from "@/store/store";

export const updateUserDataAction = (userId: string) => {
    return async (dispatch: AppDispach) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as ExtendedUser;
            dispatch(authActions.setUser(data));
        }
    }
}