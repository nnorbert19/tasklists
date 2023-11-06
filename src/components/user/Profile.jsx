'use client';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';

function Profile() {
  /*async function getUser() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
    });
  }
  useEffect(() => {
    getUser();
  }, []);*/
  return <div>Enter</div>;
}

export default Profile;
