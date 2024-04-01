'use server';

import { firestore, storage } from '@/app/firebase/config';
import { update } from 'firebase/database';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import puppeteer from 'puppeteer';

// Handle User Changing Linked Portfolio Url, Send Back An Image Of New One
export async function portfolioImageUpload(url: string, user_id: string) {
  let browser = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Adjust viewport and wait for any lazy-loaded content
    await page.setViewport({ width: 1280, height: 709 });

    // Set timer for users web page contents to fully load
    await new Promise((resolve) => setTimeout(() => resolve(''), 3500));

    // Take a screenshot
    const screenshot = await page.screenshot();

    // Close the browser
    await browser.close();
    const serializedData = JSON.stringify(Array.from(screenshot));
    return serializedData;
  } catch (error) {
    console.log(error);
  }
}

// Handle User Changing Linked Portfolio Url, Update Portfolio DB With New Data
export async function portfolioUpload(
  portfolioUrl: string,
  portfolioImgURL: any,
  user_uid: string
) {
  try {
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
