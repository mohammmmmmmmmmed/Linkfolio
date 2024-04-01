'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Logo from '@/public/icons/logo.svg';
import { useGenerationStore } from '@/store/modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { Bell, Folder, LogOut, Settings, User } from 'lucide-react';
import Notification from './notification';
import { signOut } from 'firebase/auth';

const Nav = () => {
  const { setActive, type, setType } = useGenerationStore();
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [userNotif, setUserNotif] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  return (
    <nav className='z-40 flex items-center justify-between bg-white py-[22px] drop-shadow-md'>
      <Link href='/' className='flex w-fit items-center gap-[15px]'>
        <Image src={Logo} width={44} height={35} alt='logo' />
        <p className='important text-[18px]'>Linkfolio</p>
      </Link>
      <section className='flex items-center gap-[46px]'>
        <Link href='/portfolios' className='transition-all hover:text-cta'>
          Portfolios
        </Link>
        {/* {user ? (
          <section className='relative flex items-center'>
            <button
              className='select-none'
              onClick={() => {
                setUserNotif(!userNotif);
                setUserMenu(false);
              }}
            >
              <Bell />
            </button>
            {userNotif && (
              <div className='scrollable-content scroll absolute right-0 top-9 flex h-[280px] w-[334px] flex-col gap-[5px] overflow-y-scroll rounded-[8px] border border-border bg-white'>
                <section className='border-b '>
                  <span className='flex justify-between px-[20px] pb-[8px] pt-[18px]'>
                    <h3 className='text-[14px] font-semibold text-important'>
                      Notifications
                    </h3>
                    <button className='text-[12px] font-light hover:underline'>
                      clear all
                    </button>
                  </span>
                </section>
                <section className='px-[20px] pt-[10px]'>
                  <h4 className='text-[12px] text-[color:#AEAEAE]'>TODAY</h4>
                </section>
                <Notification />
                <Notification />
                <Notification />
                <Notification />
                <Notification />
                <Notification />
              </div>
            )}
          </section>
        ) : (
          ''
        )} */}
        {user && type !== 'setup' ? (
          <section className='relative flex items-center'>
            <button
              className='select-none'
              onClick={() => {
                setUserMenu(!userMenu);
                setUserNotif(false);
              }}
            >
              <Image
                className='select-none rounded-full'
                draggable={false}
                src={user.photoURL ? user.photoURL : '/images/default.png'}
                width={46}
                height={46}
                alt=''
              />
            </button>
            {userMenu && (
              <div className='absolute right-0 top-12 flex w-[146px] flex-col gap-[5px] rounded-[8px] border border-border bg-white px-[6px] py-[13px]'>
                {/* <Link */}
                {/*   className='flex items-center gap-[8px] rounded-[8px] px-[2px] py-[8px] text-[14px] text-important hover:bg-unactive' */}
                {/*   href='/' */}
                {/* > */}
                {/*   <Folder /> */}
                {/*   My Portfolio */}
                {/* </Link> */}
                <Link
                  className='flex items-center gap-[8px] rounded-[8px] px-[2px] py-[8px] text-[14px] text-important hover:bg-unactive'
                  href='/settings'
                >
                  <Settings />
                  Settings
                </Link>
                <button
                  className='flex items-center gap-[8px] rounded-[8px] px-[2px] py-[8px] text-[14px] text-red-500 hover:bg-unactive'
                  onClick={() => signOut(auth)}
                >
                  <LogOut />
                  Sign Out
                </button>
              </div>
            )}
          </section>
        ) : (
          <button
            className='rounded-[50px] bg-cta px-[31px] py-[9px] text-white'
            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
              setActive(true);
              setType('signup');
              e.stopPropagation();
            }}
          >
            Sign Up
          </button>
        )}
      </section>
    </nav>
  );
};

export default Nav;
