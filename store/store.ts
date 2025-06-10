import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth-slice";
import dateReducer from "./date/date-slice";
import trainingReducer from "./training/training-slice";
import exerciseReducer from "./exercise/exercise-slice";
import timerReducer from "./timer/timer-slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        auth: authReducer,
        date: dateReducer,
        training: trainingReducer,
        exercise: exerciseReducer,
        timer: timerReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispach = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispach>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;