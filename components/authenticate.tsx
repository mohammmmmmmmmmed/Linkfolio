'use client';
import React from 'react';
import Nav from './nav';
import { useGenerationStore } from '@/store/modal';
import Modal from './modal';

const Authenticate = () => {
  const { setActive, type, setType } = useGenerationStore();
  return (
    <>
      <Modal />
      <Nav />
      <main className=' mt-[109px] '>
        <section>
          <h2 className='text-center'>Authentication Required</h2>
          <p className='text-center'>
            <button
              className='text-cta'
              onClick={() => {
                setActive(true);
                setType('signin');
              }}
            >
              Log in
            </button>{' '}
            to access this content
          </p>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Authenticate;
