import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser=createAsyncThunk(
    "user/login",
    async (user,thunkApi)=>{
            try{
                const response=await clientServer.post(`/login`,{
                    email:user.email,
                    password:user.password
                });

                if(response.data.token){
                   localStorage.setItem("token",response.data.token)
                }else{
                    return thunkApi.rejectWithValue({message:"token not provided"})
                }
                return thunkApi.fulfillWithValue(response.data.token)
            }catch(err){
                return thunkApi.rejectWithValue(err.response.data)
            }
    }
)

export const registerUser=createAsyncThunk(
    "user/register",
    async(user,thunkApi)=>{
        try{
            const response=await clientServer.post(`/register`,{
                username:user.username,
                name:user.name,
                email:user.email,
                password:user.password
            })
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data)
        }
    }
)


export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkApi)=>{
        try{
                const response= await clientServer.get("/get_user_and_profile",{
                    params:{
                        token:user.token
                    }
                })
                return thunkApi.fulfillWithValue(response.data)
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data)
        }
    }
)