import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data); //사가작업을 여기서 해준다
//다른곳에서도 공유해서 사용해도 된다.

const Profile = () => {
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);
  //아래와 같이 훅방식으로(data, error) 사용하고 첫번째 인자는 주소, 두번째인자 fetcher는 이 주소를 어떻게 가져올지를 적어준다
  //(fetcher를 다른것으로 바꾸면 graghql도 사용할 수 있다)
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  //위의 방식은 limit의 숫자만 늘린것으로 기존의 데이터가 중첩된다는 점에서 단점이 있다..  
  //이경우 useEffect 에 followersData의 id로 비교해서 기존 state에 concat을 하면 된다 3개 3개 3개 이런식으로 불러오는 방법을 사용하자
  //(여기선 그냥 중복을 감안하고 사용한것이다.)
  //data, error 가 둘다 없으면 로딩중이란 뜻이기 때문에.. 로딩표시를 하면 된다
  //loadAction이 SSR이 되는게 아니라면 SWR을 사용하는게 좋다
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);  //더보기 버튼을 누를때마다 기존의 리미트를 3씩올려준다
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  //*** 훅스에서 컴포넌트 코딩을 할 때 useEffect() 를 실행하기 전에 return을 해버리면 어떤때는 4번, 3번 실행횟수가 달라져버리면
  //  훅스컴포넌트는 에러를 발생시킨다!!  어떤 경우에도 훅스는 모두 실행되어야 한다!! 그래서 return이 훅스보다 위에있을 수 없다!!!
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return '팔로잉/팔로워 로딩 중 에러가 발생했습니다.'; //이건 div를 감싼것과 같다
  }

  if (!me) {
    return '내 정보 로딩중...';
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followerError && !followersData} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;
