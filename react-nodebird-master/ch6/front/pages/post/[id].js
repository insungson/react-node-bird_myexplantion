import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';

import axios from 'axios';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import wrapper from '../../store/configureStore';
import PostCard from '../../components/PostCard';
import AppLayout from '../../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query;

  //이 코드를 넣어주면... 아래의 paths 에서 설정한 부분이외에 데이터를 요청할때 응답받을때까지  이곳의 return화면으로 바꿔준다
  // if (router.isFallback) {  
  //   return <div>Loading...</div>
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// //아래의 코드는 서버사이드랜더링을 getServerSideProps 가 아닌 getStaticProps로 한다는 가정하에 아래의 코드를 사용한 것이다
// export async function getStaticPaths() { //paths, fallback을 리턴해준다. 
//   //const result = await axios.get('/post/list')  //로 리스트를 전체불러와서 사용하면되지만... 그럴바엔 serverSideProps를 사용하자
//   return {     //그래서 필요한 
//     paths: [
//       { params: { id: '1' } }, //이렇게 하면 1번게시글이 미리 빌딩이 된다 (아래는4번까지 적어놨으므로 4번까지는 미리HTML을 만들어놓는다)
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//       { params: { id: '4' } },
//     ],
//     fallback: true, //false로 하면 위의 paths에 없는 목록은 페이지가 안뜬다. true로 하면 나머지는 서버에 요청하여 뜨게 된다
//   };                 //next@9.4.5 이상에서는 문제들이 해결되었다
// }

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  console.log(context);
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id, //다이네믹 라우팅으로 id가 있기 때문에 params로 접근해서 요청을 하면 된다
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Post;
