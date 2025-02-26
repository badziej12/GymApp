import { createContext, Dispatch, FC, ReactNode, useContext, useState } from "react";
import { arrayUnion, doc, getDocs, query, runTransaction, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, groupsRef, usersRef } from "@/firebaseConfig";

type DateContextType = {
    selectedDate: Date;
    setSelectedDate: Dispatch<React.SetStateAction<Date>>;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDate = () => {
  const value = useContext(DateContext);
  if (!value) {
    throw new Error('useDate must be wrapped in a <DateContextProvider />');
  }

  return value;
}

type DateContextProviderProps = {
    children: ReactNode;
}

export const DateContextProvider: FC<DateContextProviderProps> = ({children}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // const createGroup = async (groupName: string, userId: string) => {
    //     try {
    //         // console.log(userId);
    //         // console.log(groupName);
    //         const groupQuery = query(groupsRef, where("name", "==", groupName));
    //         const querySnapshot = await getDocs(groupQuery);

    //         if (!querySnapshot.empty) {
    //             throw new Error("Group with this name already exist!");
    //         }

    //         await runTransaction(db, async (transaction) => {
    //             const newGroupRef = doc(groupsRef);

    //             transaction.set(newGroupRef, {
    //                 name: groupName,
    //                 members: [userId],
    //                 createdAt: serverTimestamp(),
    //             });

    //             const newGroupId = newGroupRef.id;

    //             const userRef = doc(usersRef, userId);

    //             transaction.update(userRef, {
    //                 groups: arrayUnion(newGroupId),
    //             });
    //         })
            
            
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //         throw e;
    //     }
    // } 

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    );
}