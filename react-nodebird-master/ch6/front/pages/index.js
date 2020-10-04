import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

//***HYDRATE는 getServerSideProps 에서 dispatch를 하면 store에 정보가 들어가는데..  
//initialState가 초기상태 그대로 있지만 getServerSideProps가 실행되면 
//그 결과를 HYDRATE 액션이 실행되면서 받는다(HYDRATE는 리듀서/index.js 에 있음)
export const getServerSideProps = wrapper.getServerSideProps(async (context) => { //매개변수로 context 사용
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; //***기존의 쿠키를 지워준다 (내정보 없애기)
  if (context.req && cookie) { //***이 조건을 사용하지 않고 (내정보 쿠키가 있고 서버사이드랜더링을 할때만 디폴트 쿠키값 적용!)
    axios.defaults.headers.Cookie = cookie; //***이 구문만 사용한다면.. 내가 로긴하고 뒷사람이 같은 페이지로 로긴한다면.. 내정보로 로긴된다
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END); //***이것을 넣어줘야 프론트에서 서버로 요청하고 서버에서 응답을 받을때까지 기다려준다
  console.log('getServerSideProps end'); 
  await context.store.sagaTask.toPromise(); //이것도 써줘야 서버에서 응답을 받을때까지 기다려준다.. 이걸 안쓰면 프론트->서버 요청만하고
});                                       //데이터가 서버에서 응답이 안오기 때문에... 서버사이드랜더링이 안된다.

export default Home;
