//기존에 _app.js 에서 <provider stroe={}></provider> 이런식으로 감쌌는데... next6버전부턴... 감쌀 필요가 없어졌다
//오히려 감싸면 에러가 발생한다 

//*** 비동기는 항상 실패를 고려해야한다.. 그래서 요청, 성공, 실패를 구현해야한다..
//context API는 useEffect에서 요청, 성공, 실패를 구현한다.. (컴포넌트 내에서 구현해야한다 - useEffect 안에)
//컴포넌트에서는... 화면만 구성해야한다.. useEffect 같은걸 구현하면 안된다

//비동기 요청이 많다면... 그냥 리덕스, 몹엑스를 쓰면 된다

//개발모드는 누적히스토리를 가지고있기 때문에... 느리지만... 배포는 누적히스토리를 없애기 때문에... 
//  배포버전은 메모리 부족이 발생하지 않는다


//리듀서는  아래처럼 이전상태, 액션을 받아서 다음 상태로 바꿔주는 행동이다.
//(이전상태, 액션) => 다음상태

//액션 함수를 사용하는 경우도 있다.(해당 리듀서에서...)
const changeNickName = (data) => {
  return {
    typr: 'CHANGE_NICKNAME',
    data,
  }
};
//위와 같이 리듀서에서 액션함수를 만들고 컴포넌트에서 아래와 같이 사용할 수 있다.
Store.dispatch(changeNickName('helloReact'));

//사가에선 비동기액션을 만든다.


//reducers/user.js 에서 아래와 같은 액션크리에이터를 만들고
//로긴 액션크리에이터
export const loginAction = (data) => {
  return {
    type: LOG_IN,
    data,
  }
};
//component/LoginForm.js 에서 아래와같이 리듀서액션을 가져오고
import { loginAction } from '../reducers/user';
//아래와 같이 사용하면 된다
  //아래는 리듀서에서 만든 액션크리에이터를 가져온것이다.
  const onSubmitForm = useCallback(() => {
    dispatch(loginAction({
      id,
      password,
    }));
  }, [id, password]);


//////////////////////////////////
// 미들웨어와 리덕스 데브툴즈

//hydrate 가 생긴 이유!
//getInitialProps 가 요즘 거의 안쓰이고, getStaticProps, getServersideProps 가 요즘 쓰이기 때문에 바뀌었다

//package.json에서  아래와 같이 -p 포트번호를 쓰면 포트번호가 바뀐다
"scripts": {
  "dev": "next -p 3060",
  "build": "next build",
  "start": "next start"
},


/////////////////////////////////
//리듀서 쪼개기

//reducers 폴더에서 user.js, post,js 로 나눠서 관리한다
//reducers 폴더 index.js 에서 combineReducers 함수를 사용하여 user, post의 리듀서를 합쳐준다
  //리듀서 합치는 메서드 
  //(객체끼리는 합치기 쉬워도 함수는 합치기 어렵기 때문에.. combineReducers 를 사용하여 합치는 것이다.)

  //아래 부분은 추가된 부분으로 SSR을 할때 HYDRATE를 사용하기 위한 index 추가부분이다
  index: (state = {}, action) => { //서버사이드랜더링을 위해 hydrate 부분을 위한 index를 추가한 것이다.
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      default: //이것을 빠뜨리면 Reducer "user" returned undefined during initializtion 에러가 발생한다
        return state;
    }
  },



///////////////////////////
//더미데이터와 포스트폼 만들기
//reducers 폴더 post.js 에서 더미데이터를 initialState로 만들어본다

//뭔가 글자를 칠때 [object Object]   가 뜬이유는!!  문자열 => 객체로 변환되고 있다는 뜻이다.. 
//(state, useState 부분을 체크해보면 된다)

//component/postForm.js 에서 dispatch는 객체를 넣어 사용한다 그리고 actionCreator 객체를 넣는다
const onSubmit = useCallback(() => {
  dispatch(addPost); 
  //addPost(객체)는 reducer/post.js 에서 import 한것으로 dispatch안에는 객체가 들어가야한다.
  //action은 객체이다. 그래서 동적으로 바뀌는 객체를만들고 싶다면..해당 reducer에서 동적 액션 객체를만들면 된다
}, []);




//////////////////////////
//게시글 구현하기
//component/postCard.js 에서 optional chaining(옵셔녈 체이닝) 연산자는 아래와 같이 사용가능하다
const id = useSelector((state) => state.user.me && state.user.me.id);
//위의 me && me.id 는 이제 me?.id  로 사용이 가능하다 (state.user.me?.id  로 사용가능)
// me.id 가 있으면 그게 들어가고 .. 없으면 undefined가 들어가는 optional chaining(옵셔녈 체이닝) 연산자이다

const onToggleLike = useCallback(() => {
  setLiked((prev) => !prev); //이전 데이터에 ! 를 붙이면 반대값이 나오므로 그것을 이용하여 만듬
}, []);



/////////////////////////////
//댓글 구현하기
//react-hook-form 같은 좋은 form 라이브러리를 사용해도 좋다



////////////////////////////
//이미지 구현하기
//component/PostImage.js 에서 아래와같이 img 태그의 역할을 설정할 수 있다
        {/* img 태그에서 role="presentation" 은 클릭할수 있지만 굳이 클릭할 필요는 없다는 뜻이다 */}
        <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} />


///////////////////////////////
//이미지 케루셀 구현하기 (react-slick)
//component/ImagesZoom/index.js 에서  Slick 태그안에 map으로 이미지를 돌려주면 react-slick이 
//이미지 케루셀을 구현해준다.
//슬라이드의 index번호는 따로 스테이트로 저장해둔다 

//component/ImagesZoom/style.js 에서 아래부분의 $ >  같은 부분은 자식 선택자로 태그의 자식을 나타낸다
export const Indicator = styled.div`
  text-align: center;
  
  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;



//////////////////////////////////
//글로벌 스타일과 컴포넌트 폴더구조
// 슬릭은 이미 클래스이름을 정하기 때문에 스타일링할때 주의해야 한다!!
//스타일드 컴포넌트가 이런부분을 덮어쓸수 있게 만들어준다

//component/ImageZoom/style.js 에서 아래와 같이 createGlobalStyle 를 사용해서 태그를 만들어준다
//createGlobalStyle 은 기존의 slick을 사용할때 정해진 클래스이름에 스타일링을 덧씌워주는 역할을 해준다
//그리고 랜더링할 컴포넌트에서 Global 태그를 넣어주면 된다
export const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block;
  }
`
//그래서 global 과 개별적인 스타일드컴포넌트를 적절하게 사용해서 만들어준다

//***스타일드컴포넌트를 사용하려면 바벨설정은 필수이다!!



/////////////////////////////////////
//게시글 해시태그 링크로 만들기
//component/PostCard.js 에서 게시글 태그를 클릭시 링크로 해당게시글만 검색할 수 있게 만들어보자
//일단 PostCardContent.js 에서 정규표현식을 사용하여 태그를 추출하여 next/Link 의 Link로 걸어준다
