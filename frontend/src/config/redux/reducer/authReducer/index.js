import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, loginUser,registerUser } from "../../action/authAction"

const initialState={
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[]
}


const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage:(state)=>{
            state.message=""
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.message="logging in..."
        })
        .addCase(loginUser.fulfilled,(state)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message="logged in successfully"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true;
            state.message="registering You..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message={
                message:"Registration Is Successfull,Please Login..."
            }
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.user=action.payload.profile
        })
    }
})

export const{reset,emptyMessage}=authSlice.actions
export default authSlice.reducer;