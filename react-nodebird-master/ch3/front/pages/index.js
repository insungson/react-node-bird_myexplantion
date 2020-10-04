import React from 'react';
import { useSelector } from 'react-redux';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';

const Home = () => {
  const { isLoggedIn } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  return (
    <AppLayout>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c.id} post={c} /> 
          //map을 사용할때는 key를 사용해야 한다 절대!! index는 key 사용 금지!(바뀌는 반복문에서 특히!)
        );
      })}
    </AppLayout>
  );
};

export default Home;
