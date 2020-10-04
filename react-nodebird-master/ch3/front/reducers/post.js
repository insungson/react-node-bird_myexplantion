export const initialState = {
  mainPosts: [{
    id: 1,
    User: { //시퀄라이즈에서 디비로 합쳐주는 부분은 앞글자가 대문자로 나온다 그래서 중간중간 대문자인 부분이 있다
      id: 1,
      nickname: '제로초',
    },
    content: '첫 번째 게시글',
    Images: [{
      src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }, {
      src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
    }, {
      src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
    }],
    Comments: [{
      User: {
        nickname: 'nero',
      },
      content: '우와 개정판이 나왔군요~',
    }, {
      User: {
        nickname: 'hero',
      },
      content: '얼른 사고싶어요~',
    }]
  }],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST';

export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: '제로초',
  },
  Images: [],
  Comments: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST: {
      //불변성 유지를 위해 아래같이 ...객체  처럼 이전의 객체를 유지시켜줘야 한다
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], 
        postAdded: true,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};
