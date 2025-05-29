import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DateState = {
    selectedDate: string;
}

const initialState: DateState = {
    selectedDate: new Date().toISOString(),
}

const dateSlice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setSelectedDate(state, action: PayloadAction<string>) {
            state.selectedDate = action.payload;
        },
    },
});

export const dateActions = dateSlice.actions;
export default dateSlice.reducer;