//서버사이드랜더링 준비하기
//withReduxSaga 패키지는 없어도 되기 때문에 삭제해주자

//프론트/index.js 에서 브라우저 화면이 뜨기전에 데이터가 들어왔다면.. 로그인후 새로고침할때 로그인화면이 안뜨게 된다

//리듀서/index.js 에서 기존과 다르게 처리를 해야한다.
//HYDRATE 가 리듀서안의 combine에 들어가는 user, post 에 들어가야 한다 
//기존 chap4에서 한것처럼 코드를 짠다면 initstate안은 아래와 같은 구조로 나타날 것이다.(index 내부에 user, post 가 들어있다.)
//index - user
//      |- post
//user
//post
//위와 같이 store state가 생성된다..  HYDRATE가 잘못만들어졌다는 뜻이다.
const rootReducer = combineReducers({
    index: (state = {}, action) => {
      switch (action.type) {
        case HYDRATE:
          console.log('HYDRATE', action);
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    user,
    post,
  });

//아래처럼 case: HDRATE 로 넣어야 rootreducer의 상태를 전체로 다 덮을수있다.
const rootReducer = (state, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return action.payload;
      default: {
        const combinedReducer = combineReducers({
          user,
          post,
        });
        return combinedReducer(state, action); //여기서 이렇게 한것과 위의 chap4 코드와 같은 것이다.
      }
    }
  };
//*** 이제 리덕스데브툴스를 보면 리듀서상에서 hydrate가 실행되고 initialState가 아래와 같이
//user
//post
//처럼 나오는것을 알 수 있다. 

//하나더!!  위의것만 실행하면 서버사이드랜더링에 대한 요청만 들어가고 응답을 받을 수 없는것을 확인할 수 있다.
//프론트 -> 서버 까지만 실행되어 화면에 뿌려지기 때문에 데이터가 없는 것을 알 수 있다.

//이유는... 아래의 프런트/pages/index.js 의 코드를 보자

//***HYDRATE는 getServerSideProps 에서 dispatch를 하면 store에 정보가 들어가는데..  
//initialState가 초기상태 그대로 있지만 getServerSideProps가 실행되면 
//그 결과를 HYDRATE 액션이 실행되면서 받는다(HYDRATE는 리듀서/index.js 에 있음)
export const getServerSideProps = wrapper.getServerSideProps(async (context) => { //매개변수로 context 사용
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
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END); //***이것을 넣어줘야 프론트에서 서버로 요청하고 서버에서 응답을 받을때까지 기다려준다
    console.log('getServerSideProps end'); 
    await context.store.sagaTask.toPromise(); //이것도 써줘야 서버에서 응답을 받을때까지 기다려준다.. 이걸 안쓰면 프론트->서버 요청만하고
  }); 

  //위의 코드에서 마지막 2개를(console제외) 넗어줘야 프론트 -> 서버 -> 프론트로 데이터를 받은 것을 서버사이드랜더링으로 사용할 수 있게 된다.


////////////////////////////////////////////////
//SSR시 쿠키 공유하기
//프론트/pages/index.js 에서  위의 home() 부분은 브라우저&프론트 서버에서 실행되는 부분이고
//    아래의 gerServersideProps() 부분은 프론트서버에서만 실행되는 부분이다. (프론트서버 <-> 백엔드서버 로 데이터를 주고 받아야한다)

//이전 챕터의 코드 위의 코드에서 cookie를 해더에서 따로 뽑아서 넣고 프론트서버에서 백엔드서버로 데이터를 요청해야한다.
// 서버사이드랜더링 후 devTools 의 network에서 쿠키가 제대로 전달이 되었는지 확인해보자

const cookie = context.req ? context.req.headers.cookie : '';
axios.defaults.headers.Cookie = ''; //***기존의 쿠키를 지워준다 (내정보 없애기)
if (context.req && cookie) { //***이 조건을 사용하지 않고 (내정보 쿠키가 있고 서버사이드랜더링을 할때만 디폴트 쿠키값 적용!)
  axios.defaults.headers.Cookie = cookie; //***이 구문만 사용한다면.. 내가 로긴하고 뒷사람이 같은 페이지로 로긴한다면.. 내정보로 로긴된다


///////////////////////////////////////////////////
//getStaticProps 사용해보기
//프론트/pages/about.js 에서 getStaticProps 를 사용해보자 (사실 여기서 사용한 것도 잘 사용한건 아니다.. 원칙사으론 getStaticProps가 맞다)
// 사용은 기존의 getServerProps와 같다

//*** 둘의 차이!!
//언제 접속해도 데이터가 바뀔일이 없으면 getStaticProps
//접속할때마다 데이터가 바뀐다면 getServerSideProps 를 사용한다
//(대부분의 경우 getServerSideProps 를 사용하자  getStaticProps 는 고정된 블로그나 홈페이지 같은 부분에서 사용한다
// getStaticProps 는 HTML을 미리 빌드해서 접속한 사람들이 이미 만들어진 HTML을 보기 때문에 서버에 무리가 덜가게 된다)
// (블로그나 뉴스를 제외하곤 딱히 필요한 부분이 아니다.)
// (보통 로그인한 이후 정보가 바뀌기 때문에 getStaticProps를 사용하기가 애매하다... 
// 정보가 HTML로 고정된다면 getStaticProps를 사용하는게 좋지만 실제 서비스에선 사용하기가 어렵다)
// (소셜커머스에서 이벤트 페이지정도만 사용하는게 좋다. 댓글이나 다른정보가 없다는 전제하에)



//////////////////////////////////////////////////////
//다이나믹 라우팅
//프론트/pages/post/[id].js 로 처리하면 번호에 맞게 다이나믹 라우팅처리가 된다
//사용하는 방법은 
import { useRouter } from 'next/router';  //로 useRouter를 가져오고 아래처럼 id를 사용하면 된다
const router = useRouter();
const { id } = router.query; //이렇게 id를 추출하면 된다


///////////////////////////////////////////////////////////
//css 서버사이드랜더링
//css 도 서버사이드랜더링을 해줘야 처음부터 데이터가 들어가고 css가 먹게 된다
//.babelrc  에서 플러그인에 바벨관련 ssr 부분을 css처리할 수 있도록 바꿔주자! next에서 커스텀하게 바꿔줄때 사용
//_document.js 에서 훅스가 아닌 클래스형태로 만들어줘야 한다. 
//(아직까진 app.js, document.js 에서만 getinitialProps() 를 사용한다  곧 바뀔것으로 보인다)
//(그리고 ie에서 실행하게 하기 위한 폴리필을 랜더링 하는 부분에 넣어주면 된다)


//////////////////////////////////////////////////////////////
//사용 게시글, 헤시테그 게시글
//프론트/pages/user/[id].js   에서 id에 따른 해당사용자의 게시글을 볼 수 있도록 만들어보자
//

//프론트/reducer/post.js 나 user.js 에서 액션의 상태를 공유할 수 있음 공유해서 같은 경우 case 별로 묶어서 정리해보자

//프론트/sagas/post.js 에서 encodeURIComponent() 를 사용하여 서버로 uri를 변경하여 보내고
//백엔드/routes/hashtag.js 에서 decodeURIComponent(req.params.tag) 를 사용하여 프론트에서 보낸uri를 받아서 처리한다


/////////////////////////////////////////////////////////////
//getStaticPaths
//getStatucPaths 는 getStaticProps 와 같이 쓰인다 (다니나믹 라우팅일때 쓰인다)

//프론트/pages/post/[id].js   를 살펴보자
//이곳의 코드는 getServerSideProps() 로 되어있지만.. 이것을 getStaticProps() 로 가정해보자

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

//그렇다면 위의 코드로 다이나믹 라우팅에 대한 HTML을 미리 만들어주는 것이다.

//만약 5번 게시물에 대한 정보가 필요하다면..fallback: false로 하면 에러가 뜨기 때문에..  true 로 바꾸고 아래와 같이 
//if문으로 로딩HTML을 만들어서 게시글이 5번일땐 서버에 요청하고 응답받을때 로딩화면을 HTML로 만들 수 있다

  //이 코드를 넣어주면... 아래의 paths 에서 설정한 부분이외에 데이터를 요청할때 응답받을때까지  이곳의 return화면으로 바꿔준다
  // if (router.isFallback) {  
  //   return <div>Loading...</div>
  // }


//////////////////////////////////////////////////////////////
//swr 사용해보기
//npm i swr 로 설치하고 이 라이브러리를 프론트/pages/profile.js 에서 사용해보자 (리덕스 action 대신에 이걸 사용하는 것이다 next팀에서 만듬)

//axios 는 한번 get으로 호출하면 다시 호출하지 않는 이상 이전의 데이터를 그대로 유지하고,
//swr 은 최초 한번만 호출해도 다른 곳으로 포커싱을 옮겼다가 다시 포커싱하면 새로운 데이터로 갱신된다.

//프론트/pages/profile.js  에서 swr을 사용한것을 보자
import useSWR from 'swr'; //로 불러오고 아래에서 fetcher 설정을 하고
const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data); //사가작업을 여기서 해준다
//다른곳에서도 공유해서 사용해도 된다.

//아래와 같이 훅방식으로(data, error) 사용하고 첫번째 인자는 주소, 두번째인자 fetcher는 이 주소를 어떻게 가져올지를 적어준다
//(fetcher를 다른것으로 바꾸면 graghql도 사용할 수 있다)
const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
//위의 방식은 limit의 숫자만 늘린것으로 기존의 데이터가 중첩된다는 점에서 단점이 있다..  
//이경우 useEffect 에 followersData의 id로 비교해서 기존 state에 concat을 하면 된다 3개 3개 3개 이런식으로 불러오는 방법을 사용하자
//(여기선 그냥 중복을 감안하고 사용한것이다.)
//data, error 가 둘다 없으면 로딩중이란 뜻이기 때문에.. 로딩표시를 하면 된다
//loadAction이 SSR이 되는게 아니라면 SWR을 사용하는게 좋다

//*** 훅스에서 컴포넌트 코딩을 할 때 useEffect() 를 실행하기 전에 return을 해버리면 어떤때는 4번, 3번 실행횟수가 달라져버리면
//  훅스컴포넌트는 에러를 발생시킨다!!  어떤 경우에도 훅스는 모두 실행되어야 한다!! 그래서 return이 훅스보다 위에있을 수 없다!!!
if (followerError || followingError) {
  console.error(followerError || followingError);
  return '팔로잉/팔로워 로딩 중 에러가 발생했습니다.'; //이건 div를 감싼것과 같다
}

if (!me) {
  return '내 정보 로딩중...';
}


//https://velog.io/@silver2473/axios-%EC%99%B8%EA%B8%B8%EC%9D%B8%EC%83%9D-swr%EC%9D%84-%EB%A7%8C%EB%82%98%EB%8B%A4  swr 블로그
//https://swr.vercel.app/     swr 공식홈피


/////////////////////////////////////////////////////////////
//해시태그 검색하기
//