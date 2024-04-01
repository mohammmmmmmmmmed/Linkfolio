import React from 'react';

const Loading = () => {
  return (
    <section className='flex flex-col justify-between rounded-[20px] border border-border bg-white'>
      <div className='skeleton aspect-video w-full rounded-[8px] border-b border-border bg-border object-cover p-[17px]'></div>
      <div className='flex gap-[10px] px-[17px] py-[23px]'>
        <div className='skeleton h-[68px] w-[68px] rounded-full bg-border'></div>
        <div className='flex w-full flex-col items-start gap-[10px]'>
          <span className='skeleton h-[25px] w-1/2 bg-border'></span>
          <span className='skeleton h-[25px] w-1/3 bg-border'></span>
        </div>
      </div>
    </section>
  );
};

export default Loading;
