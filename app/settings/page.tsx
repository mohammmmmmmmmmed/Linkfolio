'use client';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import Profile from '@/components/profile';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '@/app/firebase/config';
import Authenticate from '@/components/authenticate';
import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { UserData } from '@/types';
import { AlertCircle, Edit2, X } from 'lucide-react';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { portfolioImageUpload } from '../helper/portfolio';
import Image from 'next/image';

const page = () => {
  // User Data
  const [user, isLoading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null); // User Data That Can Be Edited
  const [userTemp, setUserTemp] = useState<UserData | null>(null); // Back Up For User Data
  const [profilePicture, setProfilePicture] = useState<Blob | null>(null); // Hold Users Uploaded Picture
  const [highlight, setHighlight] = useState<boolean>(false); // Allows Inputs To Be Highlighted Based On User Action

  // User Actions
  const [edit, setEdit] = useState<{
    settings: boolean;
    preferences: boolean;
    password: boolean;
  }>({
    settings: true,
    preferences: true,
    password: true,
  });

  // Loading States
  const [loading, setLoading] = useState<{
    settings: boolean;
    preferences: boolean;
    password: boolean;
  }>({
    settings: false,
    preferences: false,
    password: false,
  });

  // Grab Additional User Data
  useEffect(() => {
    async function handleUserGrab() {
      if (!user) return;
      const userDoc = doc(firestore, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        setUserData({
          displayName: userSnapshot.data().displayName,
          email: userSnapshot.data().email,
          emailVisible: userSnapshot.data().emailVisible,
          newsletter: userSnapshot.data().newsletter,
          photoURL: userSnapshot.data().photoURL,
          portfolioURL: userSnapshot.data().portfolioURL,
          setup: userSnapshot.data().setup,
          title: userSnapshot.data().title,
          uid: userSnapshot.data().uid,
        });

        // Create Duplicate User Data For User To Alter Freely
        setUserTemp({
          displayName: userSnapshot.data().displayName,
          email: userSnapshot.data().email,
          emailVisible: userSnapshot.data().emailVisible,
          newsletter: userSnapshot.data().newsletter,
          photoURL: userSnapshot.data().photoURL,
          portfolioURL: userSnapshot.data().portfolioURL,
          setup: userSnapshot.data().setup,
          title: userSnapshot.data().title,
          uid: userSnapshot.data().uid,
        });
      }
    }

    if (user && !isLoading) {
      handleUserGrab();
    }
  }, [user]);

  // Change Selected Value For Select Input On Users Title
  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setUserData(() =>
      userData ? { ...userData, title: e.target.value } : null
    );
  }

  // Update Approrpriate Data Changed From User Settings
  async function updateSettings() {
    if (!user || !userData || !userTemp) return;
    setLoading({ ...loading, settings: true });

    let portfolioURL;

    // Check If User Has Altered/Entered Their Portfolio Url To Take New Screenshot
    if (userData.portfolioURL !== userTemp.portfolioURL) {
      if (!userData.portfolioURL) return;
      const response = await portfolioImageUpload(
        userData.portfolioURL,
        userData.uid
      );

      if (response) {
        let screenshot = new Uint8Array(JSON.parse(response));

        // Convert Uint8Array to a Blob
        const blob = new Blob([screenshot], {
          type: 'image/png',
        });

        if (blob) {
          // Upload the Blob to Firestore Storage
          const storageRef = ref(
            storage,
            '/users/' + user.uid + '/' + Date.now()
          );
          portfolioURL = await uploadBytesResumable(storageRef, blob).then(
            () => {
              return getDownloadURL(storageRef);
            }
          );
        }
      }
    }

    let photoURL;

    // Check If User Has Changed Their Profile Picture
    if (profilePicture) {
      const fileRef = ref(storage, '/profile/' + user.uid);
      try {
        const snapshot = await uploadBytes(fileRef, profilePicture).then(() => {
          return getDownloadURL(fileRef);
        });
        photoURL = snapshot;

        const userDoc = doc(firestore, 'users', user.uid);
        await updateDoc(userDoc, {
          email: userData.email,
          displayName: userData.displayName,
          title: userData.title,
          portfolioURL: userData.portfolioURL,
          timestamp: serverTimestamp(),
          photoURL: photoURL || userData.photoURL,
        });

        // Update Local Profile Of User
        await updateProfile(user, {
          displayName: userData.displayName,
          photoURL: photoURL,
        });
      } catch (e: any) {
        console.log('error occuring here', e);
        return;
      }
    }

    // Change Loading State For User Feedback
    setLoading({ ...loading, settings: false });

    setUserTemp(() =>
      userTemp
        ? {
            ...userTemp,
            email: userData.email,
            displayName: userData.displayName,
            title: userData.title,
          }
        : null
    );

    // Only If User Has Altered Portfolio URL, Update Their Portfolio Doc
    if (
      userData.portfolioURL !== userTemp.portfolioURL ||
      userData.displayName !== userTemp.displayName ||
      userData.title !== userTemp.title ||
      photoURL
    ) {
      const docRef = doc(firestore, 'portfolios', user.uid);
      const docSnap = await getDoc(docRef);
      if (portfolioURL) {
        await setDoc(docRef, {
          portfolioURL: userData.portfolioURL,
          photoURL: portfolioURL,
          views: 0,
          owner_displayName: userData.displayName,
          owner_photoURL: photoURL || userData.photoURL,
          owner_title: userData.title,
          timestamp: serverTimestamp(),
        });
      } else if (docSnap.exists()) {
        await updateDoc(docRef, {
          portfolioURL: userData.portfolioURL,
          views: 0,
          owner_displayName: userData.displayName,
          owner_photoURL: photoURL || userData.photoURL,
          owner_title: userData.title,
          timestamp: serverTimestamp(),
        });
      }
    }

    setEdit({ ...edit, settings: true });
  }

  // Update Approrpriate Data Changed From User Preferences
  async function updatePreferences() {
    if (!user || !userData) return;
    setLoading({ ...loading, preferences: true });
    const userDoc = doc(firestore, 'users', user.uid);
    await updateDoc(userDoc, {
      emailVisible: userData.emailVisible,
      newsletter: userData?.newsletter,
    });
    setLoading({ ...loading, preferences: false });
    setUserTemp(() =>
      userTemp
        ? {
            ...userTemp,
            emailVisible: userData.emailVisible,
            newsletter: userData.newsletter,
          }
        : null
    );
    setEdit({ ...edit, preferences: true });
  }

  function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
    }
  }

  // Display Authentication Required Message For Non-Logged In Users
  if (!user && !isLoading) {
    return <Authenticate />;
  } else if (user && !isLoading) {
    return (
      <>
        <Nav />
        <main>
          <section className='mx-auto mb-[200px] mt-[109px] max-w-[1278px] space-y-[20px]'>
            <section className='flex w-full items-center justify-between rounded-[8px] border border-border bg-white'>
              <Profile
                photoURL={user.photoURL ? user.photoURL : ''}
                displayName={user?.displayName ? user.displayName : ''}
                title={userData?.title ? userData.title : ''}
              />
              <span className='mr-[20px] flex items-center gap-[20px]'>
                {userData?.portfolioURL ? (
                  <button className='w-fit self-end rounded-[8px] bg-cta px-[25px] py-[13px] text-white'>
                    View Portfolio
                  </button>
                ) : (
                  <button
                    className='flex w-fit items-center gap-[8px] self-end rounded-[8px] bg-red-400 px-[25px] py-[13px] text-white'
                    disabled={true}
                    // onClick={() => handleLinkPortfolio()}
                  >
                    <AlertCircle />
                    Portfolio Not Linked
                  </button>
                )}
              </span>
            </section>
            <section className='w-full rounded-[8px] border border-border bg-white  px-[20px] py-[31px]'>
              <div className='flex justify-between'>
                <span className=''>
                  <h2 className=''>Account Settings</h2>
                  <p className='text-unimportant'>
                    Here you can change your account information
                  </p>
                </span>
                {edit.settings ? (
                  <button
                    onClick={() =>
                      setEdit({ ...edit, settings: !edit.settings })
                    }
                  >
                    <Edit2 size={22} className='' />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserData(userTemp);
                      setEdit({ ...edit, settings: !edit.settings });
                    }}
                  >
                    <X size={22} className='' />
                  </button>
                )}
              </div>

              <div className='mt-[31px] flex flex-col flex-wrap items-end justify-start gap-[20px] second:flex-row'>
                <section className='flex min-w-[608px] flex-[0.5] flex-col gap-[4px]'>
                  <label htmlFor='email'>Email</label>
                  <input
                    id='email'
                    value={userData ? userData.email : ''}
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-unimportant'
                    placeholder='Your Email Address'
                    type='email'
                    disabled
                    onChange={(e) =>
                      setUserData((prevData) =>
                        prevData ? { ...prevData, email: e.target.value } : null
                      )
                    }
                  />
                </section>
                <section className='flex min-w-[608px] flex-[0.5] flex-col gap-[4px]'>
                  <label htmlFor='fullname'>Full Name</label>
                  <input
                    id='fullname'
                    value={userData?.displayName ? userData?.displayName : ''}
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-important disabled:text-unimportant'
                    placeholder='Your Full Name'
                    type='text'
                    disabled={edit.settings ? true : false}
                    onChange={(e) =>
                      setUserData((prevData) =>
                        prevData
                          ? { ...prevData, displayName: e.target.value }
                          : null
                      )
                    }
                  />
                </section>
                <section className='flex min-w-[608px] flex-[0.5] flex-col gap-[4px]'>
                  <label htmlFor='title'>Title</label>
                  <select
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general'
                    value={userData?.title || ''}
                    onChange={handleSelectChange}
                    disabled={edit.settings ? true : false}
                  >
                    <option
                      value=''
                      className='text-unimportant'
                      disabled
                      hidden
                    ></option>
                    <option value='swe' className='text-unimportant'>
                      Software Engineer
                    </option>
                    <option value='fe' className='text-unimportant'>
                      Front End Developer
                    </option>
                    <option value='be' className='text-unimportant'>
                      Back End Developer
                    </option>
                    <option value='ui' className='text-unimportant'>
                      UI/UX Designer
                    </option>
                    <option value='pd' className='text-unimportant'>
                      Product Designer
                    </option>
                  </select>
                </section>
                <section className='flex min-w-[608px] flex-[0.5] flex-col gap-[4px]'>
                  <label htmlFor='portfoliourl'>Portfolio URL</label>
                  <input
                    id='portfoliourl'
                    value={userData?.portfolioURL ? userData?.portfolioURL : ''}
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-important disabled:text-unimportant'
                    placeholder='Your Portolio URL'
                    type='text'
                    autoFocus={highlight}
                    disabled={edit.settings ? true : false}
                    onChange={(e) =>
                      setUserData((prevData) =>
                        prevData
                          ? { ...prevData, portfolioURL: e.target.value }
                          : null
                      )
                    }
                  />
                </section>
                <section className='flex min-w-[608px] flex-[0.5] flex-col gap-[4px]'>
                  <label className='select-none' htmlFor=''>
                    Profile Picture
                  </label>
                  {profilePicture && !edit.settings && (
                    <Image
                      className='my-[6px] rounded-full'
                      src={
                        (profilePicture &&
                          URL.createObjectURL(profilePicture)) ||
                        ''
                      }
                      width={50}
                      height={50}
                      alt=''
                    />
                  )}
                  <input
                    type='file'
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder='Upload Your Profile Picture'
                    disabled={edit.settings ? true : false}
                    onChange={handlePictureUpload}
                  />
                </section>
                {!edit.settings && (
                  <div className='flex w-full justify-end'>
                    <button
                      className='relative right-0 flex justify-self-end rounded-[8px] bg-cta px-[25px] py-[13px] text-white'
                      onClick={() => updateSettings()}
                      disabled={loading.settings}
                    >
                      {loading.settings
                        ? 'Updating Settings...'
                        : 'Update Settings'}
                    </button>
                  </div>
                )}
              </div>
            </section>
            <section className='w-full rounded-[8px] border border-border bg-white  px-[20px] py-[31px]'>
              <div className='flex justify-between'>
                <span>
                  <h2 className=''>Account Preferences</h2>
                  <p className='text-unimportant'>
                    Here you can change your account preferences
                  </p>
                </span>
                {edit.preferences ? (
                  <button
                    onClick={() =>
                      setEdit({ ...edit, preferences: !edit.preferences })
                    }
                  >
                    <Edit2 size={22} className='' />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEdit({ ...edit, preferences: !edit.preferences });
                      setUserData(userTemp);
                    }}
                  >
                    <X size={22} className='' />
                  </button>
                )}
              </div>
              <div className='mt-[31px] flex flex-col justify-between gap-[20px]'>
                <section className='flex justify-between'>
                  <label className='select-none' htmlFor='emailpref'>
                    Allow others to email you
                  </label>
                  <input
                    type='checkbox'
                    id='emailpref'
                    checked={userData ? userData.emailVisible : false}
                    disabled={edit.preferences}
                    onChange={(e) =>
                      setUserData((prevData) =>
                        prevData
                          ? {
                              ...prevData,
                              emailVisible: !prevData.emailVisible,
                            }
                          : null
                      )
                    }
                  />
                </section>
              </div>
            </section>
            <section className='w-full rounded-[8px] border border-border bg-white  px-[20px] py-[31px]'>
              <div className='flex justify-between'>
                <span>
                  <h2 className=''>Change Password</h2>
                  <p className='text-unimportant'>
                    Here you can change your password
                  </p>
                </span>
                <button
                  className='w-fit self-end rounded-[8px] bg-cta px-[25px] py-[13px] text-white'
                  onClick={() => {
                    user.email
                      ? sendPasswordResetEmail(auth, user.email)
                      : null;
                  }}
                >
                  Request Password Reset
                </button>
              </div>
            </section>
          </section>
        </main>
        <Footer />
      </>
    );
  }
};

export default page;
