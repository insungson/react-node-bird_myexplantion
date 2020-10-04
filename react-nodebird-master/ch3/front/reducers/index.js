import { HYDRATE } from 'next-redux-wrapper';
//redux 서버사이드랜더링을 위해 위의것을 사용한다.
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

//(이전상태, 액션) => 다음상태
const rootReducer = combineReducers({ 
  //리듀서 합치는 메서드 
  //(객체끼리는 합치기 쉬워도 함수는 합치기 어렵기 때문에.. combineReducers 를 사용하여 합치는 것이다.)
  index: (state = {}, action) => { //서버사이드랜더링을 위해 hydrate 부분을 위한 index를 추가한 것이다.
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      default: //이것을 빠뜨리면 Reducer "user" returned undefined during initializtion 에러가 발생한다
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
