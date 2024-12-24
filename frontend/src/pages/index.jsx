import Head from "next/head";
import Image from "next/image";
import {Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";


const inter=Inter({subsets:["Latin"]})

export default function Home() {

  const router=useRouter();

  return (
    <UserLayout>
    <div className={styles.container}>
      <div className={styles.mainContainer}>
            <div className={styles.mainContainer_left}>
              <p>Connect With Friends Without Exaggeration</p>
              <p>A True Social Media Platform, With Stories No Blufs!</p>
              <br></br>
              <button onClick={()=>{router.push("/login")}} className={styles.joinBtn}>Join now </button>
            </div>
            <div className={styles.mainContainer_right}>
              <img src="images/home_main_connection.jpg"></img>
            </div>
      </div>
    </div>
    </UserLayout>
  );
}
