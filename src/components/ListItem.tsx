import React from 'react';
import { ArrowUpIcon, ChatIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Tag, TagLabel, Text } from '@chakra-ui/react';
import { HNItem } from '../types';

const ListItem = ({ item, index }: { item: HNItem; index?: number }) => {
    const { hostname } = new URL(item.url || 'https://news.ycombinator.com');

    const getElapsedTime = (date: number) => {
        const SECONDS_IN_MINUTE = 60;
        const SECONDS_IN_HOUR = 3600;
        const SECONDS_IN_DAY = 86400;
        const MINUTES_IN_HOUR = 60;
        const HOURS_IN_DAY = 24;
        const MILLISECONDS_MULTIPLIER = 1000;

        // Get total seconds between the times
        let delta = Math.abs(new Date().getTime() / MILLISECONDS_MULTIPLIER - date);

        // Calculate (and subtract) whole days
        const days = Math.floor(delta / SECONDS_IN_DAY);
        if (days) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        delta -= days * SECONDS_IN_DAY;

        // Calculate (and subtract) whole hours
        const hours = Math.floor(delta / SECONDS_IN_HOUR) % HOURS_IN_DAY;
        if (hours) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        delta -= hours * SECONDS_IN_HOUR;

        // Calculate (and subtract) whole minutes
        const minutes = Math.floor(delta / SECONDS_IN_MINUTE) % MINUTES_IN_HOUR;
        if (minutes) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        delta -= minutes * SECONDS_IN_MINUTE;

        // What's left in seconds
        const seconds = delta % SECONDS_IN_MINUTE;
        return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    };
    return (
        <Flex direction='row' align='center' mb='4'>
            <Flex style={{ flex: 2 }} justify='center' mt='-8'>
                <Tag size='md' key='md' borderRadius='full' variant='solid' colorScheme='teal'>
                    <TagLabel>{index}</TagLabel>
                </Tag>
            </Flex>
            <div style={{ flex: 12 }}>
                <Flex direction='column'>
                    <Heading as='h3' size='sm'>
                        <a href={item.url} target='_blank'>
                            {item.title}
                        </a>
                    </Heading>
                    <Flex direction='row' justify='space-between' mt='2' wrap='wrap'>
                        <Text fontSize='sm' color='gray.500'>
                            {hostname}
                        </Text>
                        <Text fontSize='sm'>
                            {getElapsedTime(item.time)} - by <span style={{ color: '#2b6cb0' }}>{item.by}</span>
                        </Text>
                    </Flex>
                    <Flex direction='row'>
                        <Button leftIcon={<ArrowUpIcon />} colorScheme='blue' variant='ghost'>
                            {item.score}
                        </Button>
                        <Button leftIcon={<ChatIcon />} colorScheme='orange' variant='ghost'>
                            {typeof item.descendants === 'number' ? item.descendants : 0}
                        </Button>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    );
};

export default ListItem;
