import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TimerSliceState = {
    isRunning: boolean;
    restTime: number;
    restExerciseId: number | null;
}

const initialState: TimerSliceState = {
    isRunning: true,
    restTime: 0,
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
        setRestTime(state, action: PayloadAction<number>) {
            state.restTime = action.payload;
        },
    }
});

export const timerActions = timerSlice.actions;
export default timerSlice.reducer;