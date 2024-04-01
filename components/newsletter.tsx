'use client';
import { firestore } from '@/app/firebase/config';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { FormEvent, useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState<string | null>(null);
  async function handleNewsLetter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newsletterDoc = doc(firestore, 'newsletter', 'accepted');
    await updateDoc(newsletterDoc, {
      email: arrayUnion(email),
    });
  }
  return (
    <div className='mx-auto flex max-w-[1278px] flex-col gap-[20px] pb-[370px] second:flex-row second:items-center second:justify-between'>
      <section>
        <h2 className='font-semibold text-important'>Join our newsletter</h2>
        <p className='text-general'>
          Stay up to date as we push out new features
        </p>
      </section>
      <form
        className='flex justify-between gap-[25px]'
        onSubmit={handleNewsLetter}
      >
        <input
          placeholder='Your Email Address'
          type='email'
          className='w-full rounded-[20px] border border-border bg-white px-[19px] py-[13px] placeholder:text-unimportant second:w-[458px]'
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='rounded-[20px] bg-cta px-[44px] py-[12px] text-white'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
