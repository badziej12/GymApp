import { useAppSelector } from '@/store/store';
import { getDate } from 'date-fns';
import { FC, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const itemWidth = 32; // day item width
const itemGap = 16; // gap between items

type DayCarouselProps = {
    daysRow: Date[];
    onDateSelect: (day: string) => void;
    showFullMonth: boolean;
}

export const DayCarousel: FC<DayCarouselProps> = ({ daysRow, onDateSelect, showFullMonth }) => {
    const selectedDateString = useAppSelector(state => state.date.selectedDate);

    const carouselWidth = itemWidth * daysRow.length + itemGap * (daysRow.length - 1);
    const translateValue = carouselWidth / 4 + 4;

    const [translateState, setTranslateState] = useState(translateValue);
    const isTranslating = translateValue === translateState;

    const selectedDate = useMemo(() => new Date(selectedDateString), [selectedDateString]);

    const handleDateSelect = (day: string, index: number) => {
        const currentIndex = 8;
        const swipeToIndex = index - currentIndex;
        const translateValue = (itemWidth + itemGap) * swipeToIndex;

        LayoutAnimation.spring();

        setTranslateState((prevTranslate) => {
            return prevTranslate + translateValue;
        })

        setTimeout(() => {
            onDateSelect(day);
            setTranslateState(prev => translateState);
        }, 400);
    }

    return (
        <View className="flex-row" style={{ display: showFullMonth ? "none" : "flex", height: itemWidth, gap: itemGap, transform: [{ translateX: -translateState }] }}>
            {daysRow.map((day, index) => (
                <Pressable onPress={() => isTranslating ? handleDateSelect(day.toISOString(), index) : null} key={index} style={styles.dayContainer} className={"flex flex-col items-center"}>
                    <View className={`rounded-sm ${day.toDateString() === selectedDate.toDateString() ? 'bg-primary relative bottom-1' : 'bg-white'}`} style={styles.dayElement}>
                        <Text className={`${day.toDateString() === selectedDate.toDateString() ? 'text-scarlet-500' : 'text-background-400'}`} style={styles.dayText}>
                            {getDate(day)}
                        </Text>
                    </View>

                    {(day.toDateString() === selectedDate.toDateString()) && <View className='bg-primary h-0.5 w-3/5' />}
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    dayContainer: {
        display: "flex",
        width: itemWidth,
        height: itemWidth,
    },
    dayElement: {
        display: "flex",
        width: '100%',
        height: '100%',
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    dayText: {
        fontWeight: "light",
        fontSize: hp(1.6),
    }
})
