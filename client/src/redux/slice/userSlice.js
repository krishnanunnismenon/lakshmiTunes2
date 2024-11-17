import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId:null,
    email:null,
    role:null
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            const {user} = action.payload;

            state.userId = user.userId ;
            state.email = user.email;
            state.role = user.role
        },

        userLogout:(state)=>{
            state.userId = null
            state.email = null
            state.role = null
            localStorage.removeItem("userToken")
        }
    }
})

export const {setUser,userLogout} = userSlice.actions;
export default userSlice.reducer;
export const selectCurrentUser = (state)=>state.auth.user