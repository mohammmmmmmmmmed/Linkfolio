'use client';
import { firestore } from '@/app/firebase/config';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import Preview from '@/components/preview';
import Profile from '@/components/profile';
import { PortfolioData } from '@/types';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import React, { useEffect, useState } from 'react';

const page = () => {
  const uid = usePathname().split('/')[2];
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [extraPortfolios, setExtraPortfolios] = useState<
    PortfolioData[] | [] | null
  >(null);

  useEffect(() => {
    handlePortfolio();
  }, []);

  useEffect(() => {
    if (portfolio) {
      handleExtraPortfolios();
    }
  }, [portfolio]);

  async function handlePortfolio() {
    const portfolioDocRef = doc(firestore, 'portfolios', uid);
    const portfolioDocSnap = await getDoc(portfolioDocRef);
    if (portfolioDocSnap.exists()) {
      setPortfolio({
        owner_displayName: portfolioDocSnap.data().owner_displayName,
        owner_photoURL: portfolioDocSnap.data().owner_photoURL,
        owner_title: portfolioDocSnap.data().owner_title,
        photoURL: portfolioDocSnap.data().photoURL,
        portfolioURL: portfolioDocSnap.data().portfolioURL,
        timestamp: portfolioDocSnap.data().timestamp,
        views: portfolioDocSnap.data().views,
        uid: uid,
      });
    }
  }

  async function handleExtraPortfolios() {
    const portfolioCollectionRef = collection(firestore, 'portfolios');
    let q;
    if (portfolio?.owner_title) {
      q = query(
        portfolioCollectionRef,
        limit(3),
        where('owner_title', '==', portfolio.owner_title),
        where('timestamp', '!=', portfolio.timestamp)
      );
    } else {
      q = query(
        portfolioCollectionRef,
        limit(3),
        where('timestamp', '!=', portfolio?.timestamp)
      );
    }
    const portfolioSnapshot = await getDocs(q);
    if (!portfolioSnapshot.empty) {
      portfolioSnapshot.forEach((portfolio) => {
        if (extraPortfolios) {
          setExtraPortfolios([
            ...extraPortfolios,
            {
              photoURL: portfolio.data().photoURL,
              portfolioURL: portfolio.data().portfolioURL,
              owner_displayName: portfolio.data().owner_displayName,
              owner_photoURL: portfolio.data().owner_photoURL,
              owner_title: portfolio.data().owner_title,
              views: portfolio.data().views,
              timestamp: portfolio.data().timestamp,
              uid: portfolio.id,
            },
          ]);
        } else {
          setExtraPortfolios([
            {
              photoURL: portfolio.data().photoURL,
              portfolioURL: portfolio.data().portfolioURL,
              owner_displayName: portfolio.data().owner_displayName,
              owner_photoURL: portfolio.data().owner_photoURL,
              owner_title: portfolio.data().owner_title,
              views: portfolio.data().views,
              timestamp: portfolio.data().timestamp,
              uid: portfolio.id,
            },
          ]);
        }
      });
    } else {
      setExtraPortfolios([]);
    }
  }
  return (
    <>
      <Nav />
      <main className=''>
        <section className='mx-auto max-w-[1278px] pt-[109px]'>
          <div className='flex flex-col items-center justify-between gap-[40px] second:flex-row second:gap-[0px]'>
            <section className='flex w-full items-center justify-between rounded-[8px] border border-border bg-white pr-[31px] second:flex-[0.7]'>
              <Profile
                photoURL={portfolio?.owner_photoURL}
                displayName={portfolio?.owner_displayName}
                title={portfolio?.owner_title}
              />
              {/* <button className='flex h-[55px] w-[55px] items-center justify-center rounded-full bg-gray-500'> */}
              {/*   <Mail /> */}
              {/* </button> */}
            </section>
            {portfolio && (
              <a
                href={portfolio?.portfolioURL}
                target='_blank'
                className='h-fit rounded-[8px] bg-cta px-[42px] py-[11px] text-white'
              >
                Visit Portfolio
              </a>
            )}
          </div>
        </section>
        <section className='relative mx-auto mb-[81px] mt-[50px] aspect-auto aspect-video w-full  max-w-[1278px] bg-gray-50 first:h-[709px]'>
          {portfolio?.photoURL && (
            <Image
              className='w-full border border-border object-contain'
              src={portfolio?.photoURL}
              fill
              alt=''
            />
          )}
        </section>
        <section className='mx-auto mb-[204px] max-w-[1278px]'>
          <h1 className='heading'>Similar Portfolios</h1>
          <section className='mt-[18px] grid grid-cols-1 gap-[20px] second:grid-cols-2 first:grid-cols-3'>
            {extraPortfolios !== null && extraPortfolios.length !== 0 ? (
              extraPortfolios.map((extra) => (
                <Preview
                  redirect={extra.uid}
                  image={extra.photoURL}
                  owner_displayName={extra.owner_displayName}
                  owner_title={extra.owner_title}
                  owner_photoURL={extra.owner_photoURL}
                />
              ))
            ) : (
              <p className='text-[14px] italic text-red-400'>
                No Similar Portfolios Found
              </p>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default page;
