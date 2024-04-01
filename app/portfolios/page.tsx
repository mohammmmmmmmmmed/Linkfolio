'use client';
import Footer from '@/components/footer';
import Modal from '@/components/modal';
import Nav from '@/components/nav';
import Preview from '@/components/preview';
import { PortfolioData } from '@/types';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { ChevronUp, SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { firestore } from '../firebase/config';

type Filter = {
  title: string;
  query: string;
  active: boolean;
  type: string;
};

type Filters = Filter[];

const filters = [
  {
    title: 'All',
    query: 'All',
    active: true,
    type: 'category',
  },
  {
    title: 'Software Developer',
    query: 'swe',
    active: false,
    type: 'category',
  },
  {
    title: 'Front End Developer',
    query: 'fe',
    active: false,
    type: 'category',
  },
  {
    title: 'Back End Developer',
    query: 'be',
    active: false,
    type: 'category',
  },
  {
    title: 'UI/UX Designer',
    query: 'ui',
    active: false,
    type: 'category',
  },
  {
    title: 'Product Designer',
    query: 'pd',
    active: false,
    type: 'category',
  },
  // {
  //   title: 'UNUSED',
  //   query: '',
  //   active: false,
  //   type: 'seperator',
  // },
  // {
  //   title: 'Most Recent',
  //   query: 'mr',
  //   active: true,
  //   type: 'time',
  // },
  // {
  //   title: 'Oldest',
  //   query: 'old',
  //   active: false,
  //   type: 'time',
  // },
];

const page = () => {
  const [filter, setFilter] = useState<Filters>(filters);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [portfolios, setPortfolios] = useState<PortfolioData[] | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    setLoading(true);
    if (isIntersecting && fetched && !limitReached) {
      setLoading(true);
      handlePortfolio();
    }
    setLoading(false);
  }, [isIntersecting]);

  function handleFilter(selectedTitle: string, selectedType: string) {
    let updatedFilter = filter.map((item) => {
      let active = item.active;
      if (item.title === selectedTitle) {
        active = !item.active;
      } else if (item.title !== selectedTitle && item.type === selectedType) {
        active = false;
      }
      return {
        ...item,
        active,
      };
    });

    // Deactivate "All" filter if another filter is selected
    if (
      selectedTitle !== 'All' &&
      selectedTitle !== 'Most Recent' &&
      selectedTitle !== 'Oldest'
    ) {
      const allFilterIndex = updatedFilter.findIndex(
        (item) => item.title === 'All'
      );
      if (allFilterIndex !== -1) {
        updatedFilter[allFilterIndex].active = false;
      }
    }

    // Check if all filters are inactive and set "All" filter to active
    if (
      updatedFilter.every((item) =>
        item.title !== 'Most Recent' && item.title !== 'Oldest'
          ? !item.active
          : item.active || !item.active
      )
    ) {
      const allFilterIndex = updatedFilter.findIndex(
        (item) => item.title === 'All'
      );
      if (allFilterIndex !== -1) {
        updatedFilter[allFilterIndex].active = true;
      }
    }

    setFilter([...updatedFilter]);
  }

  async function handlePortfolio() {
    console.log(' i was called');
    const collectionRef = collection(firestore, 'portfolios');
    // Appended Conditions That For Category, And Potential Time

    let conditions = [];
    const activeFilters = filter.filter((item) => {
      if (item.active) {
        return item.title;
      }
    });

    let category;
    let time;

    // Get active category filter
    category = activeFilters.filter((active) => {
      if (active.type === 'category') {
        return active;
      }
    });
    console.log(category);

    // Append Category Where Condition
    if (category) {
      console.log(category[0].query);
      conditions.push(where('owner_title', '==', category[0].query));
    }

    // Get active time filter
    time = activeFilters.filter((active) => {
      if (active.type === 'time') {
        return active;
      }
    });

    let active;

    // Append Appropriate Time Condition
    if (time[0] && time[0].title === 'Most Recent') {
      active = 'recent';
    } else if (time[0] && time[0].title === 'Oldest') {
      active = 'oldest';
    }

    let q;

    console.log(conditions);
    console.log(lastVisible);

    // If Category Is Default, All, Avoid Using Where Condition, Simply Query As Normal
    if (category.every((item) => item.title === 'All')) {
      console.log(' in all');
      q = query(
        collectionRef,
        orderBy('timestamp'),
        limit(6),
        startAfter(lastVisible)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const combinedPosts: {
          photoURL: any;
          portfolioURL: any;
          views: any;
          owner_displayName: any;
          owner_photoURL: any;
          owner_title: any;
          timestamp: any;
          uid: any;
        }[] = [];
        snapshot.docs.forEach((doc) => {
          combinedPosts.push({
            photoURL: doc.data().photoURL,
            portfolioURL: doc.data().portfolioURL,
            views: doc.data().views,
            owner_displayName: doc.data().owner_displayName,
            owner_photoURL: doc.data().owner_photoURL,
            owner_title: doc.data().owner_title,
            timestamp: doc.data().timestamp,
            uid: doc.id,
          });
        });
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        console.log(combinedPosts);
        if (portfolios) {
          setPortfolios([...portfolios, ...combinedPosts]);
        } else {
          setPortfolios(combinedPosts);
        }
        setFetched(true);
      } else {
        setFetched(true);
        setLimitReached(true);
      }
    }
    // If Category Happens To Not Be Default, Use Where Condition To Utilize Appropriate Filter
    else {
      console.log('in else');
      q = query(
        collectionRef,
        orderBy('timestamp'),
        ...conditions,
        limit(6),
        startAfter(lastVisible)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const combinedPosts: {
          photoURL: any;
          portfolioURL: any;
          views: any;
          owner_displayName: any;
          owner_photoURL: any;
          owner_title: any;
          timestamp: any;
          uid: any;
        }[] = [];
        snapshot.docs.forEach((doc) => {
          combinedPosts.push({
            photoURL: doc.data().photoURL,
            portfolioURL: doc.data().portfolioURL,
            views: doc.data().views,
            owner_displayName: doc.data().owner_displayName,
            owner_photoURL: doc.data().owner_photoURL,
            owner_title: doc.data().owner_title,
            timestamp: doc.data().timestamp,
            uid: doc.id,
          });
        });
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        console.log(combinedPosts);
        if (portfolios) {
          setPortfolios([...portfolios, ...combinedPosts]);
        } else {
          setPortfolios(combinedPosts);
        }
        setFetched(true);
      } else {
        setFetched(true);
        setLimitReached(true);
      }
    }
  }
  useEffect(() => {
    setPortfolios(null);
    setFetched(false);
    setLimitReached(false);
    setLastVisible(null);
  }, [filter]);
  useEffect(() => {
    if (fetched === false && !limitReached) {
      handlePortfolio();
    }
  }, [fetched]);
  console.log(fetched, lastVisible, portfolios, limitReached);
  return (
    <>
      <Modal />

      <Nav />
      <main className=''>
        <section className='mx-auto max-w-[1278px] pt-[109px]'>
          <div className='filter-menu mb-[100px] flex w-fit items-start gap-[13px] rounded-[8px] border border-border bg-white px-[25px] py-[25px]'>
            {/* <button>
              <slidershorizontal
                size={42}
                classname='h-[30px] w-[30px] text-important'
              />
            </button> */}
            <section className='flex flex-row flex-wrap items-center gap-[13px]'>
              {filter.map((filter: Filter, index: number) =>
                filter.type === 'seperator' ? (
                  <div
                    className='h-[40px] w-[2px] bg-unactive'
                    key={index}
                  ></div>
                ) : (
                  <button
                    className={` rounded-[8px] px-[20px] py-[11px] text-important transition-all hover:bg-cta/50 hover:text-white ${filter.active ? 'bg-cta text-white' : 'bg-unactive text-important'}`}
                    key={index}
                    onClick={() => handleFilter(filter.title, filter.type)}
                  >
                    {filter.title}
                  </button>
                )
              )}
            </section>
          </div>

          <div className='grid  grid-cols-1 gap-[20px] second:grid-cols-2 first:grid-cols-3'>
            {portfolios?.map((portfolio, index) => (
              <Preview
                key={index}
                redirect={portfolio.uid}
                image={portfolio.photoURL}
                owner_displayName={portfolio.owner_displayName}
                owner_photoURL={portfolio.owner_photoURL}
                owner_title={portfolio.owner_title}
              />
            ))}
          </div>

          <div
            ref={ref}
            className={`${portfolios ? 'mb-[200px] mt-[50vh]' : 'mb-[200px]'} rounded-[20px] bg-unactive py-[36px] text-center text-[18px] text-important`}
          >
            {loading
              ? 'Loading'
              : limitReached
                ? 'No More Portfolios'
                : 'Load More'}
          </div>
        </section>
        <button
          className='fixed bottom-4 right-4 rounded-full bg-cta p-4 text-white'
          onClick={() => window.scrollTo(0, 0)}
        >
          <ChevronUp size={34} />
        </button>
      </main>
      <Footer />
    </>
  );
};

export default page;
