import React, { memo } from 'react';
import styled from '@emotion/styled';
import { Logo } from './Logo';

const LoadingMessages = [
  'This is where your add could be...',
  'You\'re awesome!',
  'TODO: Insert elevator music.',
  'Still faster than Windows update.',
  'Time flies like an arrow; fruit flies like a banana.',
  'Patience! This is difficult, you know...',
  'I hope it doesn\'t crash...',
  'Work, work...',
  'You seem like a nice person...',
  'Running with scissors...',
  'Digested cookies being baked again.',
  'Reading Terms and Conditions for you.',
  'Pushing pixels...',
  'Wait, what was I supposed to load?',
  'Help, I\'m trapped in a loader!',
  'Waiting Daenerys say all her titles...',
  'Whatever you do, don\'t look behind you...',
  'Let\'s hope it\'s worth the wait.',
  'Distracted by cat gifs.',
  'It loaded faster on my side. I swear!',
  'Save water and shower together.',
  'What do you call 8 Hobbits? A Hobbyte.',
  'We\'re testing your patience.',
  'The server is powered by a lemon and two electrodes.',
  'Don\'t think of purple hippos...'
]

const LoadingWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span`
  font-size: 1.3em;
  margin-left: 1rem;
  font-family: 'Noto Sans';
`;

const Loading = memo(() => {
  const message = LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)];
  return (
    <LoadingWrapper>
      <Logo animate={true} />
      <Text>{message}</Text>
    </LoadingWrapper>
  )
});

export {
  Loading
}
