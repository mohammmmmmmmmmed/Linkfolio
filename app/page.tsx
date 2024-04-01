import Accordion from '@/components/accordion';
import Footer from '@/components/footer';
import Modal from '@/components/modal';
import Nav from '@/components/nav';
import Newsletter from '@/components/newsletter';
import Preview from '@/components/preview';
import Recents from '@/components/recents';
import Image from 'next/image';
import Link from 'next/link';
const questions = [
  {
    id: 1,
    label: 'What is the purpose of Linkfolio?',
    renderContent: (
      <p>
        Linkfolio was created to ultimately give users straight-forward
        inspiration with real-world portfolios. It’s common that upon searching
        for portfolios you will be met with the same portfolios that have become
        popular within the space. Linkfolio allows the user to reach unique
        designs they have never seen before.
      </p>
    ),
  },
  {
    id: 2,
    label: 'How can I get started?',
    renderContent: (
      <p>
        Getting started is simple! You first must create an account. Upon
        creating your account you will be prompted to fill out additional
        preferences. These preferences can be added or edited at a later time.
        By linking your portfolio url to your account, you will have your
        portfolio displayed in the portfolio page automatically.
      </p>
    ),
  },
  {
    id: 3,
    label: 'How can I upload an image for my portfolio?',
    renderContent: (
      <p>
        When you link your portfolio to your account, an image of your landing
        page of your portfolio will be taken automatically, this image occurs
        3.5s after loading your given portfolio url. This image can not be
        uploaded manually.
      </p>
    ),
  },
  {
    id: 4,
    label: 'How can I update my portfolio displayed on the portfolio page?',
    renderContent: (
      <p>
        To upload your portfolio displayed on the portfolio page, simply update
        your portfolio url in your account settings, we'll do the rest.
      </p>
    ),
  },
];

export default function Home() {
  return (
    <>
      <Modal />
      <Nav />
      <main className=''>
        <header className='flex flex-col items-center space-y-[10px] pb-[150px] pt-[109px]'>
          <h1 className='title gradient'>Your portfolio, linked.</h1>
          <h2 className='max-w-[623px] text-center font-light'>
            Build your brand, ignite inspiration. Real-world portfolios for your
            creative journey.
          </h2>
        </header>
        <div className='mx-auto max-w-[1278px] pb-[150px]'>
          <section className='flex items-end justify-between'>
            <h1 className='heading'>Recently uploaded portfolios</h1>
            <Link href='/portfolios' className='font-semibold text-cta'>
              view all
            </Link>
          </section>
          <section className='mt-[18px] '>
            <Recents />
          </section>
        </div>
        <div className='mx-auto max-w-[1278px] pb-[150px]'>
          <section className='flex items-end justify-between'>
            <h1 className='heading'>Benefits of Linkfolio</h1>
            {/* <Link href='/portfolios' className='font-semibold text-cta'>
              view all
            </Link> */}
          </section>
          <section className='mt-[18px] grid grid-cols-1 grid-rows-2 gap-[20px] second:grid-cols-2'>
            <div className='row-span-2 h-full rounded-[20px] border border-border bg-white px-[17px] py-[20px]'>
              <h2>Exposure</h2>
              <p className='text-general'>
                Kick start your career by pushing your name through your
                portfolio out into the internet.
              </p>
              <Image
                className='mx-auto mb-[52px] mt-[161px]'
                src='/images/showcase.png'
                width={226}
                height={294}
                alt=''
              />
            </div>
            <div className='flex rounded-[20px] border border-border bg-white px-[17px] py-[20px]'>
              <section className=''>
                <h2>Inspiration</h2>
                <p className='text-general'>
                  Seamlessly view real world portfolios from others by filtering
                  through categories.
                </p>
              </section>
              <Image
                className='my-[54px] mr-[25px]'
                src='/images/sparkle.png'
                width={210}
                height={203}
                alt=''
              />
            </div>
            <div className='flex rounded-[20px] border border-border bg-white px-[17px] py-[20px]'>
              <section className=''>
                <h2>Community</h2>
                <p className='text-general'>
                  Involve yourself into a space in the internet that promotes
                  career growth and helps otehrs with the challenging task of
                  building a personal portfolio.
                </p>
              </section>
              <Image
                className='my-[54px] mr-[25px]'
                src='/images/community.png'
                width={210}
                height={203}
                alt=''
              />
            </div>
          </section>
        </div>
        <div className='mx-auto max-w-[1278px] pb-[150px]'>
          <section className='flex items-end justify-between'>
            <h1 className='heading'>Frequently Asked Questions</h1>
            {/* <Link href='/portfolios' className='font-semibold text-cta'>
              view all
            </Link> */}
          </section>
          <section className='mt-[18px]'>
            <Accordion items={questions} keepOthersOpen={false} />
          </section>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
