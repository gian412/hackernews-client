import {
    Box,
    Button,
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { ArrowDownIcon, ChevronDownIcon, Icon } from '@chakra-ui/icons';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import styles from '../styles/Home.module.css';
import ListItem from '../components/ListItem';
import { useRouter } from 'next/router';
import { fetchTopWithCache, fetchPostWithCache } from '../utils';
import { HNItem } from '../types';
import { useEffect } from 'react';
import Link from 'next/link';

const PAGE_SIZE = 20;

const Test: NextPage<{ posts: HNItem[]; totalPosts: number; page: number }> = ({ posts, totalPosts, page }) => {
    const router = useRouter();

    const onLoadMore = (page: number) => {
        router.push(`?page=${Number(page)}`);
    };

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/test?name=Gianluca', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw res;
            })
            .then(res => console.log(res))
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error(err);
                }
            });
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <Flex flexDirection='column' align='center'>
            <Box flex={1} width={['100%', '100%', '90%', '80%', '70%']}>
                <Head>
                    <title>Hacker News Client</title>
                    <meta name='description' content='Hacker News Client' />
                    <link rel='icon' href='/favicon.ico' />
                </Head>

                <Box className={styles.main} px={[4, 10]}>
                    <Heading as='h1' size='4xl'>
                        Hacker <span style={{ color: 'teal' }}>news</span>
                    </Heading>
                    <Link href={'/'}>
                        <a>Go to home</a>
                    </Link>

                    <Flex direction='row' justify='space-between' align='center' width='100%' mt='12'>
                        <Heading as='h2' size='xl'>
                            Top news
                        </Heading>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                Page
                            </MenuButton>
                            <MenuList>
                                {Array.from(Array(25).keys()).map(item => (
                                    <MenuItem key={item} onClick={() => onLoadMore(item + 1)}>
                                        {item + 1}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Flex>
                    <Flex direction='column' width='100%' mt='8'>
                        {posts.map((post, i) => (
                            <ListItem item={post} key={post.id} index={page * PAGE_SIZE + i + 1} />
                        ))}
                        {page && page !== 24 && (
                            <Flex direction='column' align='center'>
                                <Text
                                    color='teal'
                                    fontWeight='semibold'
                                    onClick={() => onLoadMore(page + 2)}
                                    cursor='pointer'
                                >
                                    Load more <ArrowDownIcon fontWeight='semibold' w={6} h={6} color='teal' />
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export const getServerSideProps: GetServerSideProps = async context => {
    let pageSize = PAGE_SIZE;
    let { page = 1 } = context.query;
    let posts = await fetchTopWithCache();

    page = page === 0 ? 0 : Number(page) - 1;
    const slicedPosts: number[] = posts.slice(Number(page) * Number(pageSize), (Number(page) + 1) * Number(pageSize));

    const jsonArticles = slicedPosts.map(async function (post) {
        return await fetchPostWithCache(post);
    });

    const returnedData = await Promise.all(jsonArticles);

    return {
        props: {
            posts: returnedData,
            totalPosts: posts.length,
            page,
        },
    };
};

export default Test;
