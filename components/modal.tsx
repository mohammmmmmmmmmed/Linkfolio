'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Logo from '@/public/icons/logo.svg';
import { X } from 'lucide-react';
import { useGenerationStore } from '@/store/modal';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, firestore, storage } from '@/app/firebase/config';
import { firebaseErrors } from '@/constants';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
const Modal = () => {
  // Universal Modal State
  const { active, setActive, type, setType } = useGenerationStore();

  // Modal Submit Actions
  const [submitType, setSubmitType] = useState<
    'signup' | 'signin' | 'setup' | 'google' | null
  >(null);

  // User Authentication Inputs
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  // Google Authentication Method For Sign In/Sign Up
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  // User State When Logged In
  const [user] = useAuthState(auth);

  // User Preferences Inputs Non-Dependent On Google Auth
  const [title, setTitle] = useState<string | null>(null);
  const [portfolioURL, setPortfolioURL] = useState<string | null>(null);
  const [emailVisible, setEmailVisible] = useState<boolean>(false);

  // User Preferences Inputs Dependent on Google Auth
  const [fullName, setFullName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<Blob | null>(null);

  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFormSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Setup does not require email/passwords check these first
    if (submitType === 'setup') {
      // Make sure user is logged in
      if (!user) return;
      // Update users preferences with what they enter
      let photoURL = userGoogle?.user.photoURL;

      try {
        const userDoc = doc(firestore, 'users', user.uid);

        if (profilePicture) {
          const fileRef = ref(
            storage,
            '/profile/' + user.uid || userGoogle?.user.uid + '.png'
          );
          try {
            const snapshot = await uploadBytes(fileRef, profilePicture).then(
              () => {
                return getDownloadURL(fileRef);
              }
            );
            photoURL = snapshot;
          } catch (e: any) {
            console.log(e);
            return;
          }
        }

        await updateDoc(userDoc, {
          displayName: fullName || userGoogle?.user.displayName || null,
          emailVisible,
          photoURL: photoURL || null,
          title,
          portfolioURL,
          setup: true,
        });

        await updateProfile(user, {
          photoURL: photoURL,
          displayName: fullName || userGoogle?.user.displayName || null,
        });

        setType('signup');
        setActive(false);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    if (email === null || password === null) return;

    // Sign up is a two step process, first step make sure email is not already in use and proceed user to next step
    if (submitType === 'signup') {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setEmail('');
        setPassword('');
        setError('');
        setType('setup');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    } else if (submitType === 'signin') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setActive(false);
        setEmail('');
        setPassword('');
        setError('');
        setSubmitType(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    // Check If User Using Google Authentication Has Previously Completed Setup
    async function checkSetup() {
      if (!userGoogle) return;
      try {
        const userDoc = doc(firestore, 'users', userGoogle?.user.uid);
        const userSnapshot = await getDoc(userDoc);

        // If User Has Completed Setup Previously, Skip
        if (userSnapshot.exists() && userSnapshot.data().setup) {
          setActive(false);
          setType('signin');
        } else {
          setType('setup');
          setError('');
        }
      } catch (e: any) {
        console.log(e);
      } finally {
      }
    }
    if (userGoogle) {
      checkSetup();
    }
  }, [userGoogle]);

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log('in here');
    setTitle(e.target.value);
  }

  function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
    }
  }
  return (
    <>
      {active && (
        <div className='fixed z-50 flex h-screen  w-full items-center justify-center overflow-visible bg-black/50'>
          <span className='relative mx-[20px] rounded-[8px] border-border  bg-white py-[24px] third:mx-0'>
            <button
              className='absolute right-4'
              onClick={() => {
                setActive(false);
                setType('signup');
              }}
            >
              <X />
            </button>
            <span className='mb-[21px] flex flex-col items-center px-[91px]'>
              <Image src={Logo} width={43} height={35} alt='' />
              <h2 className='mt-[11px] font-semibold'>
                {type === 'signup'
                  ? `Let's Get Started`
                  : type === 'signin'
                    ? `Let's Get Back To It`
                    : 'Almost There'}
              </h2>
              <p className='text-center text-general'>
                {type === 'signup'
                  ? `Join our community! Create an account.`
                  : type === 'signin'
                    ? `Welcome back! Please enter your details.`
                    : 'Finish creating your account by setting up your preferences!'}
              </p>
              <p className='text-center text-[14px] italic text-red-500'>
                {error && firebaseErrors[error]}
              </p>
            </span>
            {type === 'signin' || type === 'signup' ? (
              <form
                className='space-y-[27px] px-[61px]'
                onSubmit={(e) => handleFormSubmission(e)}
              >
                <section className='flex flex-col gap-[4px]'>
                  <label className='text-[14px] text-important' htmlFor='email'>
                    Email
                  </label>
                  <input
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder='Your Email address'
                    type='email'
                    required
                    id='email'
                    value={email || ''}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                </section>
                <section className='flex flex-col gap-[4px]'>
                  <label
                    className='text-[14px] text-important'
                    htmlFor='password'
                  >
                    Password
                  </label>
                  <input
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder={'Your Password'}
                    type='password'
                    id='password'
                    required
                    minLength={6}
                    value={password || ''}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                  />
                </section>
                {type === 'signup' ? (
                  <section className='flex flex-col gap-[11px]'>
                    <button
                      className='rounded-[8px] bg-cta py-[9px] text-[14px] text-white disabled:bg-cta/50'
                      onClick={() => setSubmitType('signup')}
                      type='submit'
                      disabled={loading === true ? true : false}
                    >
                      {loading === true ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <button
                      type='button'
                      className='rounded-[8px] border border-border bg-white py-[9px] text-[14px]'
                      onClick={() => signInWithGoogle()}
                    >
                      Sign up with Google
                    </button>
                    <span className='mt-[15px] select-none text-center text-[12px] text-important'>
                      Already have an account?{' '}
                      <button
                        className='text-cta'
                        onClick={() => setType('signin')}
                      >
                        Sign in
                      </button>
                    </span>
                  </section>
                ) : (
                  <section className='flex flex-col gap-[11px]'>
                    <button
                      className='rounded-[8px] bg-cta py-[9px] text-[14px] text-white'
                      onClick={() => setSubmitType('signin')}
                    >
                      Sign In
                    </button>
                    <button className='rounded-[8px] border border-border bg-white py-[9px] text-[14px]'>
                      Sign in with Google
                    </button>
                    <span className='mt-[15px] select-none text-center text-[12px] text-important'>
                      Don't have an account?{' '}
                      <button
                        className='text-cta '
                        onClick={() => setType('signup')}
                      >
                        Sign up
                      </button>
                    </span>
                  </section>
                )}
              </form>
            ) : (
              <form
                className='space-y-[27px] px-[61px]'
                onSubmit={(e) => handleFormSubmission(e)}
              >
                <section className='flex flex-col gap-[4px]'>
                  <label className='text-[14px] text-important'>
                    Preferred Title
                  </label>
                  <select
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general'
                    value={title || ''}
                    onChange={handleSelectChange}
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
                <section className='flex flex-col gap-[4px]'>
                  <label
                    className='select-none text-[14px] text-important'
                    htmlFor='fullName'
                  >
                    Full Name
                  </label>
                  <input
                    id='fullName'
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder='Your Full Name'
                    disabled={userGoogle?.user.displayName ? true : false}
                    value={
                      userGoogle?.user.displayName
                        ? userGoogle.user.displayName
                        : fullName
                          ? fullName
                          : ''
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFullName(e.target.value)
                    }
                  />
                </section>
                <section className='flex flex-col gap-[4px]'>
                  <label className='text-[14px] text-important'>
                    Portfolio URL
                  </label>
                  <input
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder='Full URL To Your Portfolio'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPortfolioURL(e.target.value)
                    }
                  />
                </section>
                <section className='flex flex-col gap-[4px]'>
                  <label className='text-[14px] text-important'>
                    Profile Picture
                  </label>
                  {profilePicture || userGoogle?.user.photoURL ? (
                    <Image
                      className='my-[6px] rounded-full'
                      src={
                        (profilePicture &&
                          URL.createObjectURL(profilePicture)) ||
                        userGoogle?.user.photoURL ||
                        ''
                      }
                      width={50}
                      height={50}
                      alt=''
                    />
                  ) : (
                    ''
                  )}
                  <input
                    type='file'
                    className='rounded-[8px] border border-border px-[15px] py-[11px] text-[12px] text-general placeholder:text-unimportant'
                    placeholder='Upload Your Profile Picture'
                    onChange={handlePictureUpload}
                  />
                </section>
                <section className='flex flex-row justify-between gap-[4px]'>
                  <label
                    className='select-none text-[14px] text-important'
                    htmlFor='emailYou'
                  >
                    Allow other users to email you
                  </label>
                  <input
                    type='checkbox'
                    id='emailYou'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmailVisible(!emailVisible)
                    }
                  />
                </section>
                <section className='flex flex-col gap-[11px]'>
                  <button
                    type='submit'
                    className='rounded-[8px] bg-cta py-[9px] text-[14px] text-white'
                    onClick={() => setSubmitType('setup')}
                  >
                    Save Preferences
                  </button>
                </section>
              </form>
            )}
          </span>
        </div>
      )}
    </>
  );
};

export default Modal;
