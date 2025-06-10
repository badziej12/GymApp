import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TimerSliceState = {
    isRunning: boolean;
    restTime: number;
    isRest: boolean;
}

const initialState: TimerSliceState = {
    isRunning: false,
    restTime: 0,
    isRest: false,
};

const timerSlice = createSlice({
    name: 'timer',
    initialState: initialState,
    reducers: {
        setIsRunning(state, action: PayloadAction<boolean>) {
            state.isRunning = action.payload;
        },
        setIsRest(state, action: PayloadAction<boolean>) {
            state.isRest = action.payload;
        },
        setRestTime(state, action: PayloadAction<number>) {
            state.restTime = action.payload;
        },
    }
});

export const timerActions = timerSlice.actions;
export default timerSlice.reducer;