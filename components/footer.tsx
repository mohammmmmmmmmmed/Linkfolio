import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className=''>
      <div className='mb-[45px] grid gap-[40px] second:grid-cols-2 second:gap-[0px]'>
        <section className='col-span-1'>
          <span className='flex flex-col gap-[11px]'>
            <h1 className='text-[14px] font-semibold text-important'>About</h1>
            <p className='text-[14px] text-general'>
              Straight-forward real-world portfolios for your inspiration.
            </p>
            {/* <section className='mt-[20px] flex flex-row gap-[8px]'> */}
            {/*   <button className='h-[50px] w-[50px] rounded-full bg-[color:#717171]'></button> */}
            {/*   <button className='h-[50px] w-[50px] rounded-full bg-[color:#717171]'></button> */}
            {/*   <button className='h-[50px] w-[50px] rounded-full bg-[color:#717171]'></button> */}
            {/* </section> */}
          </span>
        </section>
        <section className='col-span-1 grid grid-cols-3'>
          <span className='flex flex-col space-y-[11px]'>
            <h1 className='text-[14px] font-semibold text-important'>
              Useful Links
            </h1>
            <Link className='w-fit text-[14px] text-general' href='/'>
              Home
            </Link>
            <Link className='w-fit text-[14px] text-general' href='/portfolios'>
              Portfolios
            </Link>
            <Link className='w-fit text-[14px] text-general' href='/contact'>
              Contact Us
            </Link>
          </span>
          <span className='flex flex-col space-y-[11px]'>
            <h1 className='text-[14px] font-semibold text-important'>
              Contact
            </h1>
            <button className='flex w-fit flex-row gap-[8px] text-[14px] text-general'>
              yeahimjt@gmail.com
            </button>
          </span>
        </section>
      </div>
      {/* <div> */}
      {/*   <section className='mb-[81px] border-t border-border'> */}
      {/*     <p className='mt-[18px] text-center text-[14px] text-unimportant'> */}
      {/*       All Rights Reserved @ 2024. Designed and Developed by Jonathan */}
      {/*       Trevino */}
      {/*     </p> */}
      {/*   </section> */}
      {/* </div> */}
    </footer>
  );
};

export default Footer;
