import { createSlice } from "@reduxjs/toolkit";
// Initial state
const initialState = {
    currentUser: null,
    error: null,
    loading: false
}
//CreteSlice generates actioncreators, actionTypes automatically
const userSlice = createSlice({
    //name to identify slice
    name: 'user',
    initialState,
    //keys in this reducer object will be used as actiontypes that will be dispatched via dispatcher()
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null,
            state.loading = false,
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        }
    }
})

//Exporting individual functions
export const {
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateUserFailure, 
    updateUserStart, 
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess} = userSlice.actions;
// console.log("Refer below to .reducer output");
//console.log(userSlice);
export default userSlice.reducer;