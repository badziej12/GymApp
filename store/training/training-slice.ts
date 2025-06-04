import { CleanExerciseType, ExerciseSelectType } from "@/app/(app)/addTraining";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TrainingSliceState = {
    inProgress: boolean
    exerciseSelects: ExerciseSelectType[];
    lastTrainings: { date: string, exercises: CleanExerciseType[] }[];
}

const initialState: TrainingSliceState = {
    inProgress: false,
    exerciseSelects: [],
    lastTrainings: [],
};

const trainingSlice = createSlice({
    name: 'training',
    initialState,
    reducers: {
        setLastTrainings(state, action: PayloadAction<{ date: string, exercises: CleanExerciseType[] }[]>) {
            state.lastTrainings = action.payload;
        }
    }
});

export const trainingActions = trainingSlice.actions;
export default trainingSlice.reducer;