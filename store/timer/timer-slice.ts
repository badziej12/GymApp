import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TimerSliceState = {
    isRunning: boolean;
    currentRestTimeDuration: number;
    restExerciseId: number | null;
}

const initialState: TimerSliceState = {
    isRunning: true,
    currentRestTimeDuration: 0,
    restExerciseId: null,
};

const timerSlice = createSlice({
    name: 'timer',
    initialState: initialState,
    reducers: {
        setIsRunning(state, action: PayloadAction<boolean>) {
            state.isRunning = action.payload;
        },
        setRestExerciseId(state, action: PayloadAction<number | null>) {
            state.restExerciseId = action.payload;
        },
        setCurrentRestTimeDuration(state, action: PayloadAction<number>) {
            state.currentRestTimeDuration = action.payload;
        },
    }
});

export const timerActions = timerSlice.actions;
export default timerSlice.reducer;