import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ExtendedUser = {
    userId: string;
    username: string;
    groups: string[];
}

type AuthState = {
    isAuthenticated: boolean;
    user: ExtendedUser | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<ExtendedUser | null>) {
            state.user = action.payload
        },
        setIsAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        }
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;