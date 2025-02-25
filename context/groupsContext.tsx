import { createContext, FC, ReactNode, useContext } from "react";
import { addDoc, arrayUnion, doc, getDocs, query, runTransaction, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, groupsRef, usersRef } from "@/firebaseConfig";

type GroupsContextType = {
    createGroup: (groupName: string, userId: string) => Promise<void>;
}

export const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroups = () => {
  const value = useContext(GroupsContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <GroupsProvider />');
  }

  return value;
}

type GroupsProviderProps = {
    children: ReactNode;
}

export const GroupsProvider: FC<GroupsProviderProps> = ({children}) => {

    const createGroup = async (groupName: string, userId: string) => {
        try {
            // console.log(userId);
            // console.log(groupName);
            const groupQuery = query(groupsRef, where("name", "==", groupName));
            const querySnapshot = await getDocs(groupQuery);

            if (!querySnapshot.empty) {
                throw new Error("Group with this name already exist!");
            }

            await runTransaction(db, async (transaction) => {
                const newGroupRef = doc(groupsRef);

                transaction.set(newGroupRef, {
                    name: groupName,
                    members: [userId],
                    createdAt: serverTimestamp(),
                });

                const newGroupId = newGroupRef.id;

                const userRef = doc(usersRef, userId);

                transaction.update(userRef, {
                    groups: arrayUnion(newGroupId),
                });
            })
            
            
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }

    } 

    return (
        <GroupsContext.Provider value={{ createGroup }}>
            {children}
        </GroupsContext.Provider>
    );
}