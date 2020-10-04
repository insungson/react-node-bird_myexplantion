///////////////////////////////
//redux-thunk 이해하기
//
//redux의 미들웨어는 redux의 성능을 올려주는 기능을 한다
//thunk는 지연의 의미를 가지는 함수이다.
// https://github.com/reduxjs/redux-thunk   thunk 공홈이다

//아래 기존의 액션크리에이터에서
function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}
//아래와 같이 비동기적 액션크리에이터로 사용할 수 있다
function incrementAsync() {
  return (dispatch) => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}


//redux thunk의 구조는 간단하다.
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;


//미들웨어는 그냥 위와 같은 3단 고차함수이다. 
//그래서 아래와 같은 3단 커스텀 미들웨어를 만들 수 있다. (dispatch 실행때마다 log가 찍히는 미들웨어)
const loggerMiddleware = ({dispatch, getState}) => (next) => (action) => {
  console.log(action);
  return next(action);
};


//만약 thnk 로 로그인에 대한 코드를 만든다고 할때..  
//reducers/user.js 에서 아래와 같이 코드를 적어준다
//아래처럼 기존의 액션크리에이터에와 비동기액션크리에이터를 추가해주면 된다
export const loginRequest = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};

export const loginSuccess = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  }
};

export const loginFailure = (data) => {
  return {
    type: 'LOG_IN_FAILURE',
    data
  };
};
//thunk 는 아래처럼 비동기크리에이터 액션을 만들어줘야한다
//thunk의 단점은 직접 자바스크립트 코드로 delay, throttle을 구현해줘야 한다 예를 들면 아래처럼 setTimeout으로 
//딜레이등을 구현해줘야한다.. 그래서 복잡하면 무조건 사가를 사용하는것이다.
export const loginAction = async(data) => {
  return (dispatch, getState) => {
    const state = getState(); //여기서의 getState는 reducer/index의 initialState가 나온다
    setTimeout(() => {  //2초뒤에 로그인 요청이 되도록 구현한것이다.
      dispatch(loginRequestAction());
    }, 2000);
    axios.post('/api/login')
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      })
  }
};



////////////////////////////
//saga 설치하고 generator 이해하기
// store/configureStore.js 에서 sagaMiddleware 설정을 해준다
// generator 기능은 무한의 이벤트 리스너 사용이 가능하다.



/////////////////////////////////
//saga 이펙트 알아보기

//sagas/index.js 에서 all은 [] 배열을 받는다.
// fork, call은 제너레이터 함수를 실행해준다. all은 그런것을 모두 받는다.
//call 은 동기적 처리를 해주기 때문에 call로 요청을하면 응답을 받을때까지 기다리고 
//fork는 비동기적 처리를 해주기 때문에 fork로 요청처리를 하면 그냥 응답이 오든말든 다음으로 넘어간다

//saga에서 yield 를 사용하는 이유는 중간중간 테스트를 할 수 있기 때문에 버그나 상태를 체크하기 좋다


////////////////////////////////////
//take, take 시리즈, throttle 알아보기
//take 는 1번밖에 못쓰기 때문에 .. 
//while take 는 동기적으로 동작하지만
//takeEvery는 비동기적으로 동작한다는데 차이가 있다.
//sagas/login.js 에서 아래와 같이 while (true) 로 만들어야되지만.. 
function* watchLogOut() {
  while(true){
    yield take('ADD_POST_REQUEST', addPost);
  }
}
//saga에서 제공하는 takeEvery를 사용하면 비동기적으로 사용할 수 있다.
function* watchLogOut() {
  yield takeEvery('ADD_POST_REQUEST', addPost);
}

//takeLatest 는 요청이 여러번클릭을 해도 응답을 마지막껏만 하게 된다
//
// 프론트 서버                    백엔드 서버
//                ---------> 
//                --------->
//                <---------
//                <---------
//takeEvery 는 요청할떄마다 응답이 다 오지만..
// 프론트 서버                    백엔드 서버
//                ---------> 
//                --------->
//                <---------
//takeLatest 는 요청할때마다 마지막것만 응답이 온다
//(서버에는 요청한것들이 찍힌다)
//그래서 아래와 같이 throttle을 사용하여 몇초 제한을 둬서 몇초동안 받은 요청만 행동하게 한다
//제로초는 서버에서 2번중복으로 요청을 받는 경우 서버에서 2번입력되었다고 제한을 했다.

//아래와 같이 2초동안 같은 요청을 제한할 수 있다.
function* watchLogOut() {
  yield throttle('ADD_POST_REQUEST', addPOst, 2000);
}

//쓰로틀링 : 마지막 함수가 호출된 후 일정시간이 지나가기 전에 다시 호출되지 않도록 하는것
//디바운싱 : 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는것


/////////////////////////////////////////
//saga 쪼개고 reducer와 연결하기
//사가도 리듀서처럼 쪼갤 수 있다.
//사가3총사 와 관련하여 사가에서 작동하는 액션과 연관되게 리듀서도 수정하여 동작에 관련된 코드를 짜보자
//


///////////////////////////////////////
//액션과 상태 점검하기
//리듀서에서 액션동장에 대한 정의 해주기



//////////////////////////////////////
//바뀐 상태 적용하고 eslint 적용하기 .eslintrc 파일을 확인하면 된다 (아래서 설치 후 )
//eslint 설정을 하고 관련 npm을 다운받아 적용시킨다!

//babel-eslint, eslint-plugIn-react-hooks, eslint-config-airbnb, eslint-plugin-import, (전부 개발모드로만 사용)
//eslint-plugin-jsx-a11y(a11y는 접근성이다-장애인들에게 리엑트서비스를 사용하도록 스크린리더 기능을 평가한다)
//parser 에서 babel-eslint는 babel 이 최신문법을 사용하게 만들어준다

//rules 에서 "off" 로 꺼놔서 조금 느슨하게 문법을 잡도록 설정하자


///////////////////////////////////////////
//게시글, 댓글 saga 작성하기
//게시글 포스트 하는 부분은 동적으로 더미데이터를 만들 수 있다

//component/PostForm.js 에서 dispatch() 로 ADD_POST_REQUEST를 넣는 부분에서 게시글을 포스트할때 
//sagas/post.js 에서 ADD_POST_SUCCESS 부분에 ADD_POST_REQUEST에서의 data을 넣으면 해당 리듀서에서 받을 수 있는
//동적인 동작이 가능해진다

//shortId 는 겹치지 않는 아이디를 준다 (npm i shortId) 게시글 작성만들떄 더미로 다른 아이디를 얻기 위해
const id = shortId.generate();  //처럼 shortId 를 설치 후 import 로 가져와서 이렇게 사용하면 된다
//(위는 sagas/post.js 에서 사용한다)
//faker 는 더미데이터를 준다 (npm i faker) 게시글 데이터를 넣을때 다른 컨텐츠를 얻기 위해

//reducers/post.js 에서 아래와 같이 더미데이터를 넣는 코드를 짠다
export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));




/////////////////////////////////////////////////
//게시글 삭제 saga 작성하기
//reducers 의 폴더에서 각 해당폴더에서만 관리를 한다
//만약에 post 리듀서에서 user 리듀서의 데이터를 바꿔야 한다면..
//그냥 post 리듀서에서 user 리듀서의 리듀서 액션을 가져오면 된다. 

//사가 request를 하고 뒤에 반응을 하지 않는다면.. 해당 리듀서를 살펴봐야한다

//잘못된 게시글이나 데이터를 삭제할 수도 있기 때문에 ... devtools에서 확인 후 해당 리듀서에서 확인을 해봐야 한다




////////////////////////////////////////////////
//immer 도입하기
// immer 는 불변성을 찾는 사람에겐 필수적인 라이브러리이다.
//이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성은 지키면서..)







///////////////////////////////////////////////////
//faker 로 실감나는 데이터 만들기(더미데이터 넣는 라이브러리)
// npm i faker shortId 로 설치 후  아래와 같이 사용하면 된다
// 참고는 reducers/post.js 에서 보면 된다

import shortId from 'shortid';
import faker from 'faker';

export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));


//그냥 팁이지만.. redux tool kit 을 사용할 때...  switch 문을 사용하지 않기 때문에.. 코드량이 줄어드는 것을 확인할 수 있다.
// 다만... 기존의 immer와 어떻게 조합이 될지는 찾아봐야 한다

// https://redux-toolkit.js.org/usage/usage-guide    여기들어가서 참조



///////////////////////////////////////////////////
//인피니트 스크롤링 적용하기
//pages/index.js 에서 useEffect(() => {}, []) 로 빈배열을 줘서 처음에 10개의 더미데이터를 가져올 준비를 한다
//(더비데이터 요청은 reducer/post.js에서 함수를 가지고 sagas/post.js 에서 해당 리듀서 액션에서 함수를 사용하면 된다)

//아래와 같이 스크롤의 밑에서 300픽셀이 떨어지기 전에 dispatch로 데이터를 불러오는 작업을 해주자!
useEffect(() => {
  function onScroll() { //실무에서는 300픽셀정도 앞에서 로딩을 해줘야 하기 때문에 아래와 같이 -300을 해준다 
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePost && !loadPostsLoading) { // scrollY + clientHeight = scrollHeight(전체스크롤길이) 와 같다 
        dispatch({
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

//메모리관리를 위해 reactvirtualized 를 사용한다
//데이터에 로딩이 많이 되지만!! 실제로 화면에 실제로는 3개정도만 보여주는 react 메모리 관리해주는 라이브러리이다 (인스타에서 사용중)
//https://github.com/bvaughn/react-virtualized



///////////////////////////////////////////////////
//팔로우, 언팔로우 구현하기
//components/FollowButton.js에서 내정보인 me 에서 팔로잉 리스트에서  게시글 작성자와 아이디 비교후 팔로우, 언팔로우 ㅗ직을 만든다.
//이후 리듀서, 사가에서 관련 부분을 수정해준다!
//리듀서에서 목록 삭제시 filter로 목록중 해당 아이디를 삭제해 준다.


