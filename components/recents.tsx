'use client';
import { firestore } from '@/app/firebase/config';
import { PortfolioData } from '@/types';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Preview from './preview';
import Loading from './loading';

const Recents = () => {
  const [recentPortfolios, setRecentPortfolios] = useState<
    PortfolioData[] | null
  >(null);
  const n = 6; // Amount of loaders to intialize
  useEffect(() => {
    if (!recentPortfolios) {
      handleRecentPortfolios();
    }
  }, []);
  async function handleRecentPortfolios() {
    const q = query(
      collection(firestore, 'portfolios'),
      orderBy('timestamp', 'desc'),
      limit(6)
    );

    const portfoliosSnapshot = await getDocs(q);
    const combinedPosts = portfoliosSnapshot.docs.map((doc) => ({
      photoURL: doc.data().photoURL,
      portfolioURL: doc.data().portfolioURL,
      views: doc.data().views,
      owner_displayName: doc.data().owner_displayName,
      owner_photoURL: doc.data().owner_photoURL,
      owner_title: doc.data().owner_title,
      timestamp: doc.data().timestamp,
      uid: doc.id,
    }));

    setRecentPortfolios(combinedPosts);
  }
  return (
    <div className='grid grid-cols-1 gap-[20px] second:grid-cols-2 first:grid-cols-3'>
      {recentPortfolios
        ? recentPortfolios.map((portfolio, index) => (
            <Preview
              key={index}
              redirect={portfolio.uid}
              image={portfolio.photoURL}
              owner_displayName={portfolio.owner_displayName}
              owner_photoURL={portfolio.owner_photoURL}
              owner_title={portfolio.owner_title}
            />
          ))
        : [...Array(n)].map((element, index) => <Loading key={index} />)}
    </div>
  );
};

export default Recents;
