import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { format, startOfWeek, addDays, getDate, getDay, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DayCarousel from "./DayCarousel";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { dateActions } from "@/store/date/date-slice";


export const Callendar = () => {
    const [showFullMonth, setShowFullMonth] = useState(false);
    const selectedDateString = useAppSelector(state => state.date.selectedDate);
    const dispatch = useAppDispatch();

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


    const selectedDate = new Date(selectedDateString);

    const startOfTheRow = new Date(selectedDateString);
    startOfTheRow.setDate(startOfTheRow.getDate() - 8);

    const startOfCurrentMonth = startOfMonth(selectedDate);
    const endOfCurrentMonth = endOfMonth(selectedDate);
    const daysOfMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

    const previousDays = [
        subDays(startOfCurrentMonth, 3),
        subDays(startOfCurrentMonth, 2),
        subDays(startOfCurrentMonth, 1),
    ];

    const nextDays = [
        addDays(endOfCurrentMonth, 1),
        addDays(endOfCurrentMonth, 2),
        addDays(endOfCurrentMonth, 3),
    ];

    const daysRow = [...previousDays, ...daysOfMonth, ...nextDays];

    const startDayOffset = getDay(startOfCurrentMonth) - 1;
    const endDayOffset = 7 - getDay(endOfCurrentMonth);

    const paddedDaysOfMonth = [
        ...Array.from({ length: startDayOffset < 0 ? 6 : startDayOffset }, () => null),
        ...daysOfMonth,
        ...Array.from({ length: endDayOffset }, () => null)
    ];

    const handleDateSelect = (day: string) => {
        dispatch(dateActions.setSelectedDate(day));
    }

    return (
        <View style={{ position: "relative" }} className="pt-4 flex-col">
            <View className="flex-col">
                <View className="flex-col">
                    <View className="mb-3 flex flex-row justify-between px-5">
                        <Text style={{ fontSize: hp(1.6), fontFamily: "Inter_500Medium" }} className="text-primary text-center">{monthNames[selectedDate.getMonth()]}</Text>
                        <Text style={{ fontSize: hp(1.6), fontFamily: "Inter_500Medium" }} className="text-primary text-center">{selectedDate.getFullYear()}</Text>
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
                    {/* <View className="flex-row gap-4" style={{display: showFullMonth ? "none" : "flex", height: 32}}>
                        {daysRow.map((day, index) => (
                            <Pressable onPress={() => handleDateSelect(day)} key={index} style={styles.dayContainer} className={"flex-row justify-center"}>
                                <View className={`rounded-sm ${day.toDateString() === selectedDate.toDateString() ? 'bg-primary' : 'bg-white'}`} style={styles.dayElement}>
                                    <Text className={`${day.toDateString() === selectedDate.toDateString() ? 'text-scarlet-500' : 'text-background-400'}`} style={styles.dayText}>
                                        {getDate(day)}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View> */}
                    <DayCarousel daysRow={daysRow} />
                </View>
            </View>
            <View style={{ zIndex: 2, position: "absolute", top: "100%", left: 0, right: 0 }} className="bg-slate-200  px-8">
                {showFullMonth && (
                    <View className="flex-col">
                        {Array.from({ length: Math.ceil(paddedDaysOfMonth.length / 7) }, (_, i) => (
                            <View key={i} className="flex-row">
                                {paddedDaysOfMonth.slice(i * 7, (i + 1) * 7).map((day, index) => (
                                    <Pressable onPress={() => day && handleDateSelect(day.toISOString())} key={index} style={styles.dayContainer} className="flex-row justify-center">
                                        <View className={`mb-4 rounded-xl ${day?.toDateString() === startOfTheRow.toDateString() ? 'bg-slate-800' : ''}`} style={styles.dayElement}>
                                            <Text className={`${day?.toDateString() === startOfTheRow.toDateString() ? 'text-white' : 'text-slate-500'}`} style={styles.dayText}>
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
    dayContainer: {
        display: "flex",
        width: 32,
    },
    dayElement: {
        display: "flex",
        // width: "80%",
        aspectRatio: "1/1",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    dayText: {
        fontWeight: "light",
        fontSize: hp(2),
    }
})