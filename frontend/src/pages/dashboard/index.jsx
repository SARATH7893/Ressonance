import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function dashboard() {
    
    const dispatch=useDispatch() 
    const router=useRouter();
    const [isTokenThere,setIsTokenThere]=useState(false)
    const authState=useSelector((state)=>state.auth)

    useEffect(()=>{
        if(localStorage.getItem("token")===null){
            router.push('/login')        
        }
        setIsTokenThere(true)
    })

    useEffect(()=>{
      if(isTokenThere){
        dispatch(getAllPosts())
        dispatch(getAboutUser({token:localStorage.getItem('token')}))
      }
    },[isTokenThere])
    console.log(authState)

  return (
    <div>
      {/* {authState.user &&<div> Hey {authState.user.userId.name}</div>} */}
    </div>
  )
}
