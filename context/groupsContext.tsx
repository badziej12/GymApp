import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, runTransaction, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db, groupsRef, usersRef } from "@/firebaseConfig";
import { Alert } from "react-native";

type GroupsContextType = {
    createGroup: (groupName: string, userId: string) => Promise<void>;
    group: GroupStateType | null;
    bestScoreMember: {id: string, username: string, weight: number} | null;
    fetchGroupData: (id: string) => Promise<void | null>;
    addGroupMember: (username: string) => Promise<void>;
    getTrainingsByExercise: (exerciseName: string) => Promise<void| undefined>;
}

export type GroupStateType = {
    name: string;
    members: string[];
    groupSize: number;
    groupId: string;
}

export type GroupMembersType = {
    userId: string;
    username: string;
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
    const [group, setGroup] = useState<GroupStateType | null>(null);
    const [members, setMembers] = useState<GroupMembersType[] | null>(null);
    const [bestScoreMember, setBestScoreMember] = useState<{id: string, username: string, weight: number} | null>(null);

    const fetchGroupData = async (id: string) => {
        const groupId = id;
        const groupRef = doc(groupsRef, groupId);
        const docSnap = await getDoc(groupRef);
        console.log("Wywołanie funkcji fetchGroupData");

        if (docSnap.exists()) {
            const groupName = docSnap.get("name");
            const groupSize = docSnap.get("members").length;
            
            const members: GroupMembersType[] = await Promise.all(docSnap.get("members").map(async (memberId: string) => {
                const memberRef = doc(usersRef, memberId);
                const memberSnap = await getDoc(memberRef);

                if (memberSnap.exists()) {
                    return {userId: memberId,username: memberSnap.get("username")};
                }
                return;
            }));

            setMembers(members);
            setGroup({ name: groupName, groupSize: groupSize, members: docSnap.get("members"), groupId: groupId });
        } else {
            console.error("No such document!");
            return null;
        }
    }

    const createGroup = async (groupName: string, userId: string) => {
        try {
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
    
    const addGroupMember = async (username: string) => {
        try {
            const userQuery = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                Alert.alert("Uzytkownik nie istnieje");
                return;
            }
            const userData = querySnapshot.docs[0].data();
            const userId = userData.userId;

            const groupId = group?.groupId;
            const groupRef = doc(groupsRef, groupId);
            const docSnap = await getDoc(groupRef);

            if (!docSnap.exists()) {
                Alert.alert("Grupa nie istnieje!");
                return;
            }

            const groupData = docSnap.data();
            const members = groupData.members || [];

            if (members.includes(userId)) {
                Alert.alert("Użytkownik już jest w grupie");
                return;
            }

            await updateDoc(groupRef, {
                members: [...members, userId],
            });

            Alert.alert("Użytkownik został dodany do grupy!");
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Wystąpił błąd!");
        }
    }

    const getTrainingsByExercise = async (exerciseName: string) => {
        console.log("Wywołanie funkcji getTrainingsByExercise");
        if (!group) {
            console.error("Group is not set");
            return;
        }

        await Promise.all(group.members.map(async (memberId) => {
            const userRef = doc(usersRef, memberId);

            const q = query(collection(userRef, "trainings"));
            const querySnapshot = await getDocs(q);
            
            const memberName = members?.find(member => member.userId === memberId)?.username as string;
            let totalWeight: number = 0;
            
            querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string, exercises: { exerciseName: string, series: {reps: string, weight: string}[] }[] }))
                .filter((training: { id: string, exercises: { exerciseName: string, series: {reps: string, weight: string}[] }[] }) => 
                    training.exercises.some((exercise) => exercise.exerciseName === exerciseName)
                )
                .map((training: { id: string, exercises: { exerciseName: string, series: {reps: string, weight: string}[] }[] }) => {
                    training.exercises.forEach((exercise) => {
                        if (exercise.exerciseName === exerciseName) {
                            exercise.series.forEach((serie) => {
                                const serieWeight = parseInt(serie.weight);
                                const serieReps = parseInt(serie.reps);

                                totalWeight += serieWeight * serieReps;
                            })
                        }
                    })
                });

            if (bestScoreMember) {
                if (bestScoreMember.weight < totalWeight) {
                    setBestScoreMember({id: memberId, username: memberName, weight: totalWeight});
                }
            } else {
                setBestScoreMember({id: memberId, username: memberName, weight: totalWeight});
            }
        }));        
    }



    return (
        <GroupsContext.Provider value={{ createGroup, fetchGroupData, group, addGroupMember, getTrainingsByExercise, bestScoreMember }}>
            {children}
        </GroupsContext.Provider>
    );
}