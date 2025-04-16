import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { format, startOfWeek, addDays, getDate, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useDate } from "@/context/dateContext";
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';


export const Callendar = () => {
    const [showFullMonth, setShowFullMonth] = useState(false);
    const { selectedDate, setSelectedDate } = useDate();

    const monthNames = [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień"
    ];

    console.log('selected date', selectedDate);

    const startOfTheRow = new Date(selectedDate);
    startOfTheRow.setDate(startOfTheRow.getDate() - 8);

    console.log('start of the row', startOfTheRow);

    const daysRow = Array.from({ length: 17 }, (_, i) => addDays(startOfTheRow, i));

    console.log("daysRow", daysRow)

    const startOfCurrentMonth = startOfMonth(selectedDate);
    const endOfCurrentMonth = endOfMonth(selectedDate);
    const daysOfMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

    const startDayOffset = getDay(startOfCurrentMonth) - 1;
    const endDayOffset = 7 - getDay(endOfCurrentMonth);

    const paddedDaysOfMonth = [
        ...Array.from({ length: startDayOffset < 0 ? 6 : startDayOffset }, () => null),
        ...daysOfMonth,
        ...Array.from({ length: endDayOffset }, () => null)
    ];

    const handleDateSelect = (day: Date) => {
        setSelectedDate(day);
    }


    return (
        <View style={{position: "relative"}} className="pt-4 flex-col">
            <View className="flex-col">
                <View className="flex-col">
                    <View className="mb-3 flex flex-row justify-between px-5">
                        <Text style={{fontSize: hp(1.6), fontFamily: "Inter_500Medium"}} className="text-primary text-center">{monthNames[selectedDate.getMonth()]}</Text>
                        <Text style={{fontSize: hp(1.6), fontFamily: "Inter_500Medium"}} className="text-primary text-center">{selectedDate.getFullYear()}</Text>
                    </View>
                    {/* <View className="flex-row justify-around mb-4">
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>M</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>T</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>W</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>T</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>F</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>S</Text>
                        </View>
                        <View style={styles.dayContainer} className="flex-row justify-center">
                            <Text className="text-blue-600" style={{fontWeight: "bold", fontSize: hp(2)}}>S</Text>
                        </View>
                    </View> */}
                    <View className="flex-row gap-4" style={{display: showFullMonth ? "none" : "flex", height: 32}}>
                        {daysRow.map((day, index) => (
                            <Pressable onPress={() => handleDateSelect(day)} key={index} style={styles.dayContainer} className={"flex-row justify-center"}>
                                <View className={`rounded-sm ${day.toDateString() === selectedDate.toDateString() ? 'bg-primary' : 'bg-white'}`} style={styles.dayElement}>
                                    <Text className={`${day.toDateString() === selectedDate.toDateString() ? 'text-scarlet-500' : 'text-background-400'}`} style={styles.dayText}>
                                        {getDate(day)}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
                {/* {!showFullMonth && (
                    <Pressable onPress={() => setShowFullMonth(!showFullMonth)} className="py-2 flex-row justify-center">
                        <FontAwesome size={28} name={"angle-down"} color={"black"} />
                    </Pressable>
                )} */}
            </View>
            <View style={{zIndex: 2, position: "absolute", top: "100%", left: 0, right: 0}} className="bg-slate-200  px-8">
                {showFullMonth && (
                    <View className="flex-col">
                        {Array.from({ length: Math.ceil(paddedDaysOfMonth.length / 7) }, (_, i) => (
                            <View key={i} className="flex-row">
                                {paddedDaysOfMonth.slice(i * 7, (i + 1) * 7).map((day, index) => (
                                    <Pressable onPress={() => day && handleDateSelect(day)} key={index} style={styles.dayContainer} className="flex-row justify-center">
                                        <View className={`mb-4 rounded-xl ${day?.toDateString() === selectedDate.toDateString() ? 'bg-slate-800' : ''}`} style={styles.dayElement}>
                                            <Text className={`${day?.toDateString() === selectedDate.toDateString() ? 'text-white' : 'text-slate-500'}`} style={styles.dayText}>
                                                {day ? getDate(day) : ""}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        ))}
                        <Pressable onPress={() => setShowFullMonth(!showFullMonth)} className="py-6 flex-row justify-center">
                            <FontAwesome size={28} name={"angle-up"} color={"black"} />
                        </Pressable>
                    </View>
                )}
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dayContainer : {
        display: "flex",
        width: 32,
    },
    dayElement : {
        display: "flex",
        // width: "80%",
        aspectRatio: "1/1",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    dayText : {
        fontWeight: "light",
        fontSize: hp(2),
    }
})