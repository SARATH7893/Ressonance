import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/userLayout'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import styles from './style.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

function index() {

  const authState=useSelector((state)=>state.auth)
  const router=useRouter()
  const dispatch=useDispatch();
  const [userLoginMethod,setUserLoginMethod]=useState(false);

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [username,setUserName]=useState("");
  const [name,setName]=useState("")

  useEffect(()=>{
      if(authState.loggedIn){
        router.push('/dashboard')
      }
  },[authState.loggedIn])

  useEffect(()=>{
    dispatch(emptyMessage());
  },[userLoginMethod])

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  })
  const handleRegister=()=>{
    dispatch(registerUser({username,name,email,password}))
  }

  const handleLogin=()=>{
      console.log("hi")
      dispatch(loginUser({email,password}))
  }
  return (
    <UserLayout>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
              <p className={styles.cardLeft_heading}>{userLoginMethod?"Sign In":"Sign Up"}</p>
              {authState.message.message}
              <div className={styles.inputContainers}>
                      {!userLoginMethod && <div className={styles.inputRow}>
                        <input onChange={(e)=>setUserName(e.target.value)}className={styles.inputField} type='text'  placeholder='Username'></input>
                        <input onChange={(e)=>setName(e.target.value)} className={styles.inputField} type='text'  placeholder='Name'></input>
                      </div>}
                      <input onChange={(e)=>setEmail(e.target.value)} className={styles.inputField} type='text'  placeholder='Email'></input>
                      <input onChange={(e)=>{setPassword(e.target.value)}} className={styles.inputField} type='text'  placeholder='Password'></input>
                      <div onClick={()=>{
                        if(userLoginMethod){
                            handleLogin()
                        }else{
                          handleRegister()
                        }
                      }} className={styles.buttonWithOutline}>
                        <p style={{color:"white",fontWeight:"500"}}>{userLoginMethod?"Sign In":"Sign Up"}</p>
                      </div>
              </div>
            </div>
            <div className={styles.cardContainer_right}>
                <p>{userLoginMethod?"Don't have an account?":"Already have an account?"}</p>
                <div onClick={()=>{
                          setUserLoginMethod(!userLoginMethod)
                        }} className={styles.buttonWithOutline}>
                          <p style={{color:"white",fontWeight:"500",textAlign:"center"}}>{userLoginMethod?"Sign Up":"Sign In"}</p>
                        </div>    
            </div>
          </div>
        </div>
    </UserLayout>
  )
}

export default index
