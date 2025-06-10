import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseType, SerieRowType } from '@/app/(app)/addTraining';
import { AvailableExerciseType } from '@/components/Screens/addTraining/ExerciseModal';


type ExerciseState = {
    exercises: Record<number, ExerciseType>;
    availableExercises: AvailableExerciseType[];
};

const initialState: ExerciseState = {
    exercises: {},
    availableExercises: [],
};

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState,
    reducers: {
        appendExercises(state, action: PayloadAction<{ id: number, exerciseName: string }[]>) {
            action.payload.forEach(exercise => {
                state.exercises[exercise.id] = { exerciseName: exercise.exerciseName, series: [] }
            });
        },
        removeExercise(state, action: PayloadAction<number>) {
            delete state.exercises[action.payload];
        },
        cleanExercises(state) {
            state.exercises = {};
        },
        replaceExercises(state, action: PayloadAction<Record<number, ExerciseType>>) {
            state.exercises = action.payload;
        },
        initSerieRows: (state, action: PayloadAction<{ exerciseId: number; serieRows: SerieRowType[] }>) => {
            state.exercises[action.payload.exerciseId].series = action.payload.serieRows;
        },
        addSerieRow: (state, action: PayloadAction<{ exerciseId: number; newSerie: SerieRowType }>) => {
            state.exercises[action.payload.exerciseId].series.push(action.payload.newSerie);
        },
        removeSerieRow: (state, action: PayloadAction<{ exerciseId: number; serieId: number }>) => {
            state.exercises[action.payload.exerciseId].series =
                state.exercises[action.payload.exerciseId].series.filter(row => row.id !== action.payload.serieId);
        },
        updateSerieRow: (state, action: PayloadAction<{ exerciseId: number; index: number; serie: SerieRowType }>) => {
            state.exercises[action.payload.exerciseId].series[action.payload.index] = action.payload.serie;
        },
        resetSerieRows: (state, action: PayloadAction<number>) => {
            state.exercises[action.payload].series = [];
        },
        setAvailableExercises(state, action: PayloadAction<AvailableExerciseType[]>) {
            state.availableExercises = action.payload;
        },
    },
});

export const exerciseActions = exerciseSlice.actions;
export default exerciseSlice.reducer;
