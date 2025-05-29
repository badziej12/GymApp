import React, { useMemo, useEffect, FC } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { getDate } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { dateActions } from '@/store/date/date-slice';

const ITEM_WIDTH = 36;
const ITEM_GAP = 16;
const VISIBLE_ITEMS = 7;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

type DayCarouselProps = {
    daysRow: Date[];
}

const DayCarousel: FC<DayCarouselProps> = ({ daysRow }) => {
    const selectedDateString = useAppSelector(state => state.date.selectedDate);
    const selectedDate = useMemo(() => new Date(selectedDateString), [selectedDateString]);
    const dispatch = useAppDispatch();

    const translateX = useSharedValue(0);

    // This cause modal bug https://github.com/software-mansion/react-native-reanimated/issues/6659
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -translateX.value }],
    }));

    useEffect(() => {
        const index = daysRow.findIndex(
            d => d.toDateString() === selectedDate.toDateString()
        );
        if (index === -1) return;

        const targetTranslate = (ITEM_WIDTH + ITEM_GAP) * (index - CENTER_INDEX);
        translateX.value = withTiming(targetTranslate, { duration: 300 });
    }, [selectedDateString, daysRow]);

    const handleDateSelect = (index: number) => {
        dispatch(dateActions.setSelectedDate(daysRow[index].toISOString()));
    };

    return (
        <View className='self-center' style={styles.container}>
            <View className='flex-1'>
                <Animated.View className={"flex-1"} style={[styles.row, animatedStyle]}>
                    {daysRow.map((day, index) => {
                        const isSelected = day.toDateString() === selectedDate.toDateString();
                        return (
                            <Pressable
                                key={index}
                                className={`rounded-md ${isSelected ? 'bg-primary relative bottom-1' : 'bg-white'}`}
                                onPress={() => handleDateSelect(index)}
                                style={styles.item}
                            >
                                <Text className={`${isSelected ? 'text-scarlet-500' : 'text-background-400'}`} style={styles.text}>
                                    {getDate(day)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: (ITEM_WIDTH + ITEM_GAP) * VISIBLE_ITEMS - ITEM_GAP,
    },
    row: {
        flexDirection: 'row',
    },
    item: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        marginRight: ITEM_GAP,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
});

export default DayCarousel;