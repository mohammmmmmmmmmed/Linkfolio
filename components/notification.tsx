import Image from 'next/image';
import React from 'react';

const Notification = () => {
  return (
    <section className='flex gap-[7px] px-[20px] pt-[15px]'>
      <Image
        className='rounded-full'
        src='/images/face.png'
        width={30}
        height={30}
        alt=''
      />
      <span className='flex flex-col'>
        <section className='flex flex-nowrap items-center gap-[5px]'>
          <h5 className='text-[12px] font-medium'>Samantha Gonzalez</h5>
          <p className='max-w-[98px] truncate overflow-ellipsis border-l border-border pl-[7px] text-[10px] font-light'>
            Back End Developerre ewew
          </p>
        </section>
        <section>
          <p className='text-[10px]'>has bookmarked your portfolio</p>
        </section>
      </span>
    </section>
  );
};

export default Notification;
