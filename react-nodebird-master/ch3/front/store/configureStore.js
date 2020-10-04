import { applyMiddleware, createStore, compose } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension'; //개발자 도구와 연결시키는 부분 

import reducer from '../reducers';

const configureStore = (context) => {
  console.log(context);
  const middlewares = [];
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares)) //배포용일때는 히스토리이력을 없애고 (속도도 빨라진다)
    : composeWithDevTools(                    //배포용이 아닐때는 개발용툴을 사용하는 설정을 해준다
      applyMiddleware(...middlewares),
    );
  const store = createStore(reducer, enhancer); 
  //여기 스토어에서 리듀서에서 만든 state를 컴포넌트에서 가져다가 사용할 수 있다.
  return store;
};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === 'development' });

export default wrapper;
