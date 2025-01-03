import Profile from "../models/posts.model.js"
import User from "../models/user.model.js"
import Post from "../models/posts.model.js"

import bcrypt from  "bcrypt"

export const activecheck=async (req,res)=>{
    return res.status(200).json({message:"Running"})
}

export const createPost=async(req,res)=>{
    const {token}=req.body;
    try{
            const user=await User.findOne({token})
            if(!user) return res.status(404).json({message:"User not found"})
            
            const post=new Post({
                userId:user._id,
                body:req.body.body,
                media:req.file!=undefined?req.file.filename:"",
                fileType:req.file!=undefined?req.file.mimetype.split("/")[1]:""
            })    
            
            await post.save();
            return res.status(200).json({message:"post created"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const getAllPosts=async (req,res)=>{
    try{
            const posts=await Post.find().populate("userId",'name username email profilePicture')
            return res.status(200).json({posts})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deletePost=async (req,res)=>{
    const {token,post_id}=req.body
    try{
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(404).json({message:"User not found"})
        
        const post=await Post.findOne({_id:post_id})
        if(!post) return res.status(404).json({message:"Post not found"})

        if(post.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this post"})
        }
        await Post.deletePost({_id:post_id});
        return res.status(200).json({message:"Post deleted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}



export const commentPost=async (req,res)=>{
    const {token,post_id,commentBody}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(404).json({message:"user not found"});
        const post=await Post.findOne({_id:post_id})
        if(!post) return res.status(404).json({message:"post not found"})
            const comment=new Comment({
                userId:user._id,
                postId:post_id,
                comment:commentBody
            })
            await comment.save()
            return res.json({message:"comment posted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const get_comments_by_post=async(req,res)=>{
    const{post_id}=req.body;
    try{
        const post=await Post.findOne({_id:post_id});
        if(!post) return res.status(404).json({message:"post not found"})
        return res.json({comments:post.comments})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const delete_comment_of_user=async(req,res)=>{
    const {token,comment_id}=req.body;
    try{
            const user=await User.findOne({token:token}).select("_id");
            if(!user) return res.status(404).json({message:"user not found"});
            const comment=await Comment.findOne({_id:comment_id})
            if(!comment) return res.status(404).json({message:"comment not found"})
            
                if(comment.userId.toString()!==user._id.toString()){
                    return res.status(403).json({message:"You are not authorized to delete this comment"})
                }
                await Comment.deleteOne({_id:comment_id})
                return res.json({message:"comment deleted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const increment_likes=async(req,res)=>{
        const {post_id}=req.body;
        try{
            const post=await Post.findOne({_id:post_id})
            if(!post) return res.status(404).json({message:"post not found"})
            post.likes=post.likes+1;
            await post.save()
            return res.json({message:"likes incremented"})
        }catch(err){
            return res.status(500).json({message:err.message})
        }
}