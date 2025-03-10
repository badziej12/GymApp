import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { format, startOfWeek, addDays, getDate, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useDate } from "@/context/dateContext";


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

    const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

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
        <View style={{position: "relative"}} className="bg-slate-200 px-8 py-3 flex-col mb-8">
            <View className="flex-col">
                <View className="flex-col py-3">
                    <View style={{display: showFullMonth ? "flex" : 'none'}} className="mb-8">
                        <Text style={{fontSize: hp(3), fontWeight: 'bold'}} className="text-slate-800 text-center">{monthNames[selectedDate.getMonth()]}</Text>
                    </View>
                    <View className="flex-row justify-around mb-4">
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
                    </View>
                    <View className="flex-row" style={{display: showFullMonth ? "none" : "flex"}}>
                        {daysOfWeek.map((day, index) => (
                            <Pressable onPress={() => handleDateSelect(day)} key={index} style={styles.dayContainer} className={"flex-row justify-center"}>
                                <View className={`rounded-xl ${day.toDateString() === selectedDate.toDateString() ? 'bg-slate-800' : ''}`} style={styles.dayElement}>
                                    <Text className={`${day.toDateString() === selectedDate.toDateString() ? 'text-white' : 'text-slate-500'}`} style={styles.dayText}>
                                        {getDate(day)}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
                {!showFullMonth && (
                    <Pressable onPress={() => setShowFullMonth(!showFullMonth)} className="py-2 flex-row justify-center">
                        <FontAwesome size={28} name={"angle-down"} color={"black"} />
                    </Pressable>
                )}
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
        width: "14.285%",
    },
    dayElement : {
        display: "flex",
        width: "80%",
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