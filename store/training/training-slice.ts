import { CleanExerciseType, ExerciseSelectType } from "@/app/(app)/addTraining";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TrainingSliceState = {
    inProgress: boolean
    lastTrainings: { date: string, exercises: CleanExerciseType[] }[];
    trainingTime: number;
}

const initialState: TrainingSliceState = {
    inProgress: false,
    lastTrainings: [],
    trainingTime: 0,
};

const trainingSlice = createSlice({
    name: 'training',
    initialState,
    reducers: {
        setInProgress(state, action: PayloadAction<boolean>) {
            state.inProgress = action.payload;
        },
        setLastTrainings(state, action: PayloadAction<{ date: string, exercises: CleanExerciseType[] }[]>) {
            state.lastTrainings = action.payload;
        },
        incrementTrainingTime(state, action: PayloadAction<number>) {
            state.trainingTime += action.payload;
        },
        setTrainingTime(state, action: PayloadAction<number>) {
            state.trainingTime = action.payload
        },
        resetTrainingTime(state) {
            state.trainingTime = 0;
        }
    }
});

export const trainingActions = trainingSlice.actions;
export default trainingSlice.reducer;