import { createSlice } from "@reduxjs/toolkit"
import { getAllPosts } from "../../action/postAction"

const initialState={
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:""
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading=true
            state.message="Fetching All Posts ..."
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isError=false,
            state.isLoading=false,
            state.postFetched=true,
            state.posts=action.payload.posts
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isError=true,
            state.isLoading=false,
            state.message=action.payload
        })
    }
})




export default postSlice.reducer