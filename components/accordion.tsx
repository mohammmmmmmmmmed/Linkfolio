'use client';
import React, { useEffect, useState } from 'react';

type AccordionProps = {
  items: {
    id: number;
    label: string;
    renderContent: React.ReactNode;
  }[];
  keepOthersOpen: boolean;
};
const Accordion = ({ items, keepOthersOpen }: AccordionProps) => {
  const [accordionItems, setAccordionItems] = useState<
    | null
    | {
        id: number;
        label: string;
        renderContent: React.ReactNode;
        toggled: boolean;
      }[]
  >(null);

  useEffect(() => {
    if (items) {
      setAccordionItems([
        ...items.map((item) => ({
          ...item,
          toggled: false,
        })),
      ]);
    }
  }, [items]);

  function handleAccordionToggle(clickedItem: {
    id: number;
    label: string;
    renderContent: React.ReactNode;
    toggled: boolean;
  }) {
    if (accordionItems === null) return;
    setAccordionItems([
      ...accordionItems.map((item) => {
        let toggled = item.toggled;
        if (clickedItem.id === item.id) {
          toggled = !item.toggled;
        } else if (!keepOthersOpen) {
          toggled = false;
        }

        return {
          ...item,
          toggled,
        };
      }),
    ]);
  }

  return (
    <div className='flex flex-col gap-[18px]'>
      {accordionItems?.map((listItem, index) => {
        return (
          <div
            className={`rounded-[20px] border border-border bg-white p-4 ${listItem.toggled ? '' : ''}`}
            key={index}
          >
            <button
              className='toggle flex w-full justify-between px-[12px] py-[11px] pb-[16px]'
              onClick={() => handleAccordionToggle(listItem)}
            >
              <p className='font-medium'>{listItem.label}</p>
              <div>{listItem.toggled ? '-' : '+'}</div>
            </button>
            <div
              className={`max-h-0 overflow-hidden transition-all ease-out ${listItem.toggled ? 'max-h-[500px] transition-all ease-out' : 'max-h-0 transition-all ease-out'}`}
            >
              <div
                className={`pt-[18px] ${listItem.toggled ? 'border-t' : 'border-t-0'}`}
              >
                {listItem.renderContent}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
