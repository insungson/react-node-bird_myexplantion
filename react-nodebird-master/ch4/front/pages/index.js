import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import AppLayout from '../components/AppLayout';
import { LOAD_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() { //실무에서는 300픽셀정도 앞에서 로딩을 해줘야 하기 때문에 아래와 같이 -300을 해준다 
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostsLoading) { // scrollY + clientHeight = scrollHeight(전체스크롤길이) 와 같다 
          dispatch({                //위에서 리덕스의 설정에서 한 hasMorePost && !loadPostsLoading 로 화면에 뿌리는 데이터 설정함!
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll); //onSCroll를 addEventListener 를 사용한다면.. removeEventListener를 사용해줘야한다!!
    return () => {
      window.removeEventListener('scroll', onScroll); //window 객체를 사용할때는 .. 항상!! remove로 기존의 window객체를 없애줘야 한다 
    };                                              //메모리에 계속 쌓이기 때문에 항상 넣어줘야 한다!! 
  }, [mainPosts, hasMorePost, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

export default Home;
