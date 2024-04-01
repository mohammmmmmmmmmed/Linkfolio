'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Profile from './profile';
import Loading from './loading';

type PreviewProps = {
  redirect: string;
  image: string;
  owner_displayName: string;
  owner_title: string;
  owner_photoURL: string;
};

const Preview = ({
  redirect,
  image,
  owner_displayName,
  owner_title,
  owner_photoURL,
}: PreviewProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  function handleLoaded() {
    setLoaded(true);
  }
  return (
    <>
      <Link
        href={`/portfolios/${redirect}`}
        className={`flex flex-col justify-between rounded-[20px]  border border-border bg-white transition-all duration-500 hover:shadow-md second:min-h-[390px] ${loaded ? 'rotate-0 scale-100' : 'rotate-6 scale-90'}`}
      >
        <Image
          onLoad={handleLoaded}
          className={`delay-50 w-full rounded-[8px] border-b border-border object-cover p-[17px]  transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
          src={image}
          width={379}
          height={210}
          alt=''
        />
        <Profile
          photoURL={owner_photoURL}
          displayName={owner_displayName}
          title={owner_title}
        />
      </Link>
    </>
  );
};

export default Preview;
