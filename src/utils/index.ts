import cacheData from 'memory-cache';
import { HNItem } from '../types';

/**
 * Fetch top posts from HackerNews API and save to cache
 *
 * @async
 * @returns {Promise<number[]>} Array of ID of top posts fetched by HackerNews API
 */
export const fetchTopWithCache: () => Promise<number[]> = async () => {
    const API_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
    const MINUTES_TO_CACHE = 60;

    const value = cacheData.get(API_URL);
    if (value) {
        return value;
    } else {
        const minutesToCache = MINUTES_TO_CACHE;
        const res = await fetch(API_URL);
        const data = await res.json();
        cacheData.put(API_URL, data, minutesToCache * 1000 * 60);
        return data;
    }
};

/**
 * Fetch a post from HackerNews API and save to cache
 *
 * @async
 * @param post {number[]} Post ID to fetch
 * @returns {Promise <HNItem>} Post JSON fetched from HackerNews API
 */
export const fetchPostWithCache: (post: number) => Promise<HNItem> = async post => {
    const getAPIUrl = (post: number) => `https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`;

    const url = getAPIUrl(post);
    const value = cacheData.get(url);
    if (value) {
        return value;
    } else {
        const minutesToCache = 60;
        const res = await fetch(url);
        const data = await res.json();
        cacheData.put(url, data, minutesToCache * 1000 * 60);
        return data;
    }
};
