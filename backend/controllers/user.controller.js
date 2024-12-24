import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import ConnectionRequest from "../models/connections.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import PDFdocument from 'pdfkit'
import fs from 'fs'

const convertUserDataToPdf=async (userData)=>{
    const doc = new PDFdocument();
    const outputPath=crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100})
    doc.fontSize(14).text(`Name: ${userData.userId.name}`)
    doc.fontSize(14).text(`Username: ${userData.userId.username}`)
    doc.fontSize(14).text(`Email: ${userData.userId.email}`)
    doc.fontSize(14).text(`Bio: ${userData.bio}`)
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`)
    doc.fontSize(14).text("Past Work:")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name: ${work.company}`)
        doc.fontSize(14).text(`Position: ${work.position}`)
        doc.fontSize(14).text(`Years: ${work.years}`)
    })
    doc.end()
    return outputPath;
}
export const register=async (req,res)=>{
    try{
        const {name,email,password,username}=req.body;
        
        if(!name||!email||!password||!username){
            return res.status(400).json({message:"Please fill in all fields"})
        }
        
        const user=await User.findOne({
            email
        })

        if(user){
            return res.status(400).json({message:"user already exists"})
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            username
        })  
        await newUser.save();
        
        const profile=new Profile({
            userId:newUser._id
        })

        await profile.save();
        return res.json({message:"user created successfully"})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
    if(!email ||!password) return res.status(400).json({message:"all fields are required"})
        const user= await User.findOne({
            email
        })

        if(!user) return res.status(404).json({message:"user not registered"})

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({message:"invalid password"})
        
        const token =crypto.randomBytes(32).toString("hex")
        await User.updateOne({_id:user._id},{token})
        return res.json({token:token})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const uploadProfilePicture=async (req,res)=>{
    try{
        const {token}=req.body;
        const user=await User.findOne({
            token:token
        })

        if(!user) return res.status(404).json({message:"user not found"})
            console.log(req.file.filename)
        user.profilePicture=req.file.filename
        await user.save()
        return res.json({message:"profile picture uploaded successfully"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const updateUserProfile=async (req,res)=>{

    try{
        const {token,...newUserdata}=req.body;
        const user=await User.findOne({
            token:token
        })
        if(!user) return res.status(404).json({message:"user not found"})
        const {username,email}=newUserdata;
        const existingUser=await User.findOne({$or:[{username},{email}]});
        if(existingUser){
            if(existingUser || String(existingUser._id)!==String(user._id)){
                return res.status(400).json({message:"user already exists"})
            }
        }

        Object.assign(user,newUserdata);
        await user.save();
        return res.json({message:"user updated"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const getUserAndProfile= async(req,res)=>{
    try{
        const {token}=req.query;

        const user=await User.findOne({token:token})
        if(!user) return res.status(404).json({message:"user not found"})
        
        const userProfile=await Profile.findOne({userId:user._id}).populate('userId','name email username profilePicture')
        return res.json(userProfile)
        

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

//

export  const updateProfileData=async (req,res)=>{
    try{
            const {token,...newProfileData}=req.body;
            const userProfile=await User.findOne({token:token})

            if(!userProfile){
                return res.status(404).json({message:"user not found"})
            }

            const profile_to_update=await Profile.findOne({userId:userProfile._id})
            Object.assign(profile_to_update,newProfileData)
            await profile_to_update.save()
            return res.json({message:"profile updated"})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getAllProfileData=async (req,res)=>{
    try{
        const profiles= await Profile.find().populate('userId','name username email profilePicture')
        return res.json(profiles)

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const downloadProfile=async(req,res)=>{
    try{
        const user_id=req.query.id;
        const userProfile=await Profile.findOne({userId:user_id}).populate('userId','name email username profilePicture');

        let outputPath=await convertUserDataToPdf(userProfile);
        return res.json({message:outputPath})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const sendConnectionRequest=async (req,res)=>{
    const {token,connectionId}=req.body;
    try{
            const user =await user.findOne({
                token:token
            })
            if(!user) return res.status(404).json({message:"user not found"})
            
                const connectionUser= await User.findOne({_id:connectionId});
                if(!connectionUser) return res.status(404).json({message:"connection user not found"})
                
                    const existingRequst= await ConnectionRequest.findOne({
                        userId:user._id,
                        connectionId:connectionUser._id    
                    })
                    if(existingRequst) return res.status(400).json({message:"request already sent"})
                     
                    const request=await new ConnectionRequest({
                        userId:user._id,
                        connectionId:connectionUser._id
                    })

                   await request.save()
                   return res.json({message:"request sent successfully"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const getMyconnectionRequest=async (req,res)=>{
    const token =req.body
    try{
        const user =await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"user not found"})

        const connections=await ConnectionRequest.find({userId:user._id}).populate('connectionId','name username email profilePicture');
        return res.json({message:connections})

        
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}


export const whatAreMyconnections=async (req,res)=>{
    const token=req.body
    try{
            const user=await User.findOne({token:token})
            if(!user) return res.status(404).json({message:"user not found"})
            
            const myConnections=await ConnectionRequest.find({connectionId:user._id}).populate('userId','name username email profilePicture');
            return res.json(myConnections)
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const acceptConnectionRequest=async (req,res)=>{
    const {token,requestId,action_type}=req.body
    try{
            const user=await User.findOne({token:token})
            if(!user) return res.status(404).json({message:"user not found"})
            
            const connection=await ConnectionRequest.findOne({_id:requestId})
            if(!connection) return res.status(404).json({message:"connection not found"})
            if(action_type==="accept"){
                connection.status_accepted=true;
            }
            else{
                connection.status_accepted=false;
            }
            await connection.save()
            return res.json({message:"connection request updated"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

