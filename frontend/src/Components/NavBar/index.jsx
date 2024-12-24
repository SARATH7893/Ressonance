import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'

export default function NavBar() {

    const router=useRouter();

  return (
    <div>
        <div className={styles.container}>
            <nav className={styles.navBar}>
                <h1 style={{cursor:"pointer"}} onClick={()=>{
                    router.push('/')
                }}>Ressonance</h1>
                <div className={styles.navBarOptionContainer}>
                    <div onClick={()=>{
                        router.push('/login')
                    }} className={styles.buttonJoin}>Be a Part</div>
                </div>
            </nav>
        </div>
    </div>
  )
}
