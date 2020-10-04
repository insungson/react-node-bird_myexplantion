// 백엔드 노드서버 구축하기

////////////////////////////////////////////////////
//노드로 서버 구동하기
//프론트 서버는 화면의 구성만 담당하도록 하고, 
//백엔드 서버는 단순히 데이터만 담당하도록 한다


///////////////////////////////////////////////////////
//익스프레스로 라우팅하기
//데이터를 보낼땐 보통 res.json({})  으로 객체를 프론트로 보낸다.(응답한다)
// 백엔드개발자에게 json 형식의 어떤 형태로 보내줄지에 대해 잘 상의를 해야한다.

//포스트맨 사용방법
//postman 을 통해 get post put fatch 등을 다 사용할 수 있다!

//노드로 서버를 돌리고 postman으로 관련 axios 메서드를 선택하고 주소를 치면 백엔드서버에서 응답이 온다 (postman으로 요청함) 

//app.get  =>  가져오다
//app.post => 생성하다
//app.put => 전체 수정
//app.delete => 제거
//app.patch => 부분수정
//app.option => 찔러보기 (서버에 요청이 될지안될지 찔러보기)
//app.head => 헤더마 가져오기(원래는 헤더/바디 둘다 가져오는데... 이건 헤더만 가져온다)


//swagger 는  API 문서를 저장해주는 툴이다.
//자세한건 아래의 주소를 확인하자
//https://swagger.io/


/////////////////////////////////////////////////////////
//익스프레스 라우터 분리하기
//node 는 import, export가 아닌  require, module.exports  를 사용한다 
//webpack 이 import, exports 를  require, module.exports로 바꿔주기 때문이다. 
//노드는 webpack을 사용하지 않게 때문에.. 아직은 import, exports를 사용하진 않지만 곧 바뀔 것이다.
//app.js 에서 라우터를 나눠서 사용해보자

////////////////////////////////////////////////////////////
//MYSQL과 시퀄라이즈 연결하기
//mysql 사이트에 가서 mysql workbench, mysql community server, (앞에것 2개를 받거나 이 뒤의것을..)mysql intaller for windows 를 설치해준다

//npm i mysql2 sequalize-cli     를 설치해준다 
//** mysql2 는 mysql과 node 를 연결시켜주는 드라이버이다!! 

//그리고 back/models/index.js 에서 시퀄라이즈 mysql 연결설정을 해준다
//back/config/config.js  에서 DB와 연결할 변수설정을 해준다


//////////////////////////////////////////////////////////////
//시퀄라이즈 모델 만들기
//back/model 에서 user.js, post.js, image.js, hashtag.js 등 모델들의 테이블을 정의해주자
//테이블의 컬럼과 컬럼에 들어갈 데이터타입을 정의해두자!


////////////////////////////////////////////////////////////
//시퀄라이즈 관계 설정하기
//N:M 관계처럼 다대다 관계는 하나의 임시테이블이 생성된다.
//그래서 그 테이블로 연결을 하는 것이다! (검색할때는 이 테이블을 본다!)

//각 모델들의 관계를 설정해준다.
// models/comment.js 에서 보면 belongsTo 는 hasMany 와 연결되어있기 때문에 디비에 관련 id가 자동으로 생성된다.

// models/hashtag.js  와  models/post.js 의 코드에서 관계를 잘 살펴보고 아래의 예시를 보자

// hashTag                  PostHashTag                         Post
//                      hashtagId     PostId                
//1. 노드                  1            1                   1. 안녕 #노드 #리액트
//2. 리액트                2            1                   2. #노드 #익스프레스
//3. 익스프레스            1            2                   3. #뷰 #노드 #리액트
//4. 뷰                   3            2

//위와같이 시퀄라이즈가 중간테이블인 postHashTag 를 만들어주기 때문에 관계설정을 belongsToMany로 정해주면 된다.

//models/user.js 에서 팔로잉, 팔로워 관계를 볼때 foreignkey 는  foreignkey를 우선적으로 검색한다는 것을 알아두자!!

// post - user 는 foreignkey를 안쓴느데...  user - user 는 foreignkey를 쓰는 이유는?

//user              Follow(through로 만든 관계형 테이블)        post
//                 팔로잉(followingid)  팔로워(followerid)
//1제로                 1                   3                   1제로
//2네로                 2                   1                   2네로
//3부기                 3                   1                   3부기

//위의 관계에서 foreignkey는 팔로워나 팔로잉중 한개를 중점으로 관계를 찾는다(같은 테이블이므로 구분을 위해 foreignkey 사용!!)

//user                  Like(through로 만든 관계형 테이블)      post
// 1                    userId          postId                  1
// 2                       1                3                   2
// 3                       3                2                   3

//위와 같은 관계에선 foreignkey 없이 각테이블의 관계를 찾을 수 있기 때문에 사용하지 않은 것이다.

//*** through는 관계형 테이블의 테이블명을 바꿔주고   foreignkey 는 그 테이블의 컬럼명을 바꿔준다



//////////////////////////////////////////////////////////
//시퀄라이즈 sync + nodemon
//models/index.js   에서 Object.key() 로 디비와 각 모델명으로 만든 부분들을 연결하여 실행시킨다.

// db를 mysql에 설정하는 방법은  npx sequelize db:create

//nodemon 설치도 해준다



///////////////////////////////////////////////////////////
//회원가입 구현하기
//*** 백엔드/app.js 에서 아래의 코드를 보자
app.use(express.json());  //프론트에서 json 형식으로 데이터를 보낼때 req.body 형식의 데이터를 req.body안에 넣어주고
app.use(express.urlencoded({ extended: true })); // form submit을 했을때 url인코디드 방식으로 넘어가서 데이터를 req.body에 넣어준다!!

//요청/응답은 
//해더(상태(200, 500 같은), 용량, 시간, 쿠키) 와 바디(데이터)로 구성이 되어있다
//200은 성공 201은 잘 생성되었다 라는 의미


//////////////////////////////////////////////////////////
//CORS 문제 해결하기

//network 탭에서 allowaccesscontrolorigin 에러가 발생한다
//브라우저의 포트번호와 서버의 포트번호가 다르기 때문에 브라우저상에서 에러가 발생하는 것이다.
//(서버 - 서버 상포트번호가 달라도 cors 에러가 발생하지 않는다)
//(브라우저 - 서버 상 포트가 다를때 cors 에러가 발생하게 된다)

//백엔드/router/user/post('/') 부분의 코드를 보면 브라우저로 응답하는 부분에 아래와 같이 주석처리한 부분이 있다.
    // res.setHeader('Access-Control-Allow-Origin', '*'); //로 브라우저로 응답하여 cors 문제를 해결할 수도 있다
//이것을 미들웨어로 처리하면 응답시 일일이 위의 코드를 사용하지 않아도 된다

//app.js 에서 cors({origin: '허용할 주소', credestials: false})로 처리해준다  credentials 는 쿠키를 넣어 보내는 것이다.

//axios.default.baseURL('주소')  이런식으로 axios 요청을 할때 앞의 부분을 넣어 코드를 줄일 수 있다.


//////////////////////////////////////////////////////////
//패스포트로 로그인하기

//백엔드/passport/local.js 에서 패스포트의 설정을 해준다
//done(서버에러, 정보가들어감, 클라이언트에서 실패할 경우)
//위의 done() 콜백함수는 router/user.js 의 post/login 라우터에 authenticate()에 들어간다

//router/user.js 에서 post/login 부분에서 express의 미들웨어 확장에 사용하는 기법을 사용하여 req,res,next 를 처리한다
//아래의 함수만 사용한다면.... express에서 사용할 req,res,next 를 사용할 수 없기 때문에 안에 넣고 아래함수의 마지막에 (req,res,next)를 붙인다
passport.authenticate('local', (err, user, info) => {//passport의 로컬전략의 done(서버에러, 정보, 사용자에러)의 콜백함수를 여기서 받는다
    passport('local')
}(req,res,next)
//위와 같이 미들웨어를 확장시킨다.


/////////////////////////////////////////////////////////
//쿠키/세션과 전체 로그인 흐름
//로그인시 브라우저와 서버가 같은 정보를 가지고 있어야 페이지가 바뀌더라도 로그인을 유지시킬 수 있다.
//백엔드/app.js 에서 세션 설정을 해준다

//세션에는 정말 간단한 정보인 id만 가지고 있고 이를 가지고 서버에서 유저정보를 찾는다.
//정보가 많아서 메모리를 많이 사용해야한다면... redis 서비스를 사용하도록 한다.



////////////////////////////////////////////////////////
//로그인 문제 해결하기
//

//프론트/page/signup.js 에서  로그인시 페이지 변경할때 push 는 뒤로가기 하면 이전 페이지가 기록에 남지만.. replace는 기록에 남지 않는다

useEffect(() => {
    if (me && me.id) {
      Router.replace('/'); //push 는 뒤로가기하면 이전페이지로 돌아가지만  replace 는 기존의 페이지가 사라진다(기존의 기록 x)
    }
  }, [me && me.id]);


//////////////////////////////////////////////////////
// 미들웨어로 라우터 검사하기
// 미들웨어의 기본적인 형태는.. (req, res, next) => {}  이런 형태이고 직접 만들수 있다.
// 로그인에 대한 검사 미들웨어를 만들어보자
// 백엔드/router/middlewares.js 에서 로그인, 로그아웃(회원가입안한때 사용) 에 대한 미들웨어를 만들어보자
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { //req.user 로 아까 설정한 세션상에서 찾아서 처리해도 된다(여기선 passport의 함수를 사용해보자)
        next(); //이렇게 next() 빈칸이라면 다음 미들웨어로 넘어가지만..next(err)로 에러처리를 한다면.. express의 에러처리미들웨어로 넘어간다
    } else {
        res.status(404).send('로그인이 필요합니다');
    }
}


///////////////////////////////////////////////////////
//게시글, 댓글 작성하기
//프론트의 게시글 작성에 대한 사가 리듀서 부분 dummy 데이터를 이제 백엔드의 주소와 연결시켜서 처리해주자
//백엔드에서 받을 때 params로 받고... 아이디는 req.user.id 처럼 passport 에서 처리해준 백엔드 세션을 활용하자


//////////////////////////////////////////////////////
// credentials로 쿠키 공유하기
// 도메인이 다르면 쿠키도 전달이 안된다.. 
// 쿠키가 전달이 안된다면 백엔드 서버는 누가 요청했는지 알수가 없다.

//이를 해결하기 위해선 백엔드/app.js 에서 아래처럼 credentials: true 로 바꾸고
app.use(cors({
    origin: 'http://localhost:3060',
    credentials: true,
  }));

//프론트/해당 사가에서 아래처럼 credentials: true 를 넣어줘야 한다
//*** 실무에서 많이 하는 실수이므로 아래와 같이 default 값을 넣어주면 좋다  (프론트/sagas/index.js 에서 설정함)
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;  //withCredentials = true 를 설정하면 위의 baseURL로 상세한 허용주소를 설정해야 에러가 안뜬다


///////////////////////////////////////////////////////
//내 로그인 정보 매번 불러오기
//백엔드/routes/user.js 에서 get / 부분에서 로그인 후 디비에서 정보를 가져오는 코드를 적자.
// 그러면 클라이언트 로그인이 되기 때문에... 로그인이 유지는 된다.. 다만... 로그인 화면이 잠깐 나온다.. (이부분은 SSR로 해결한다)
// 백엔드의 세션을 사용하기 때문에....


////////////////////////////////////////////////////////
//게시글 불러오기
//백엔드 routes/posts.js 에서 
//게시글을 가져오는 부분을 쓸때 offset 대신 lastId로 사용한다면 중복으로 게시글을 불러오는 문제가 없어진다
// 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
//게시글이 20까지 있을때.. 21게시글을 작성한다면 11번 게시글을 2번 불러와서 중복되는 문제가 발생한다 (offset방식을 사용할때)
//그래서 여기서 lastId로 게시글을 불러온다
//lastId로 고정을 시킨다면.. 21번 게시글을 작성하더라도 11번 게시글을 보다 밑에것을 불러오기 때문에 중복으로 가져오는 문제가 없어진다

//백엔드/app.js 에서 아래의 morgan 은  프론트 => 백엔드로 요청을 보낼때 .. 
// GET /user 304 5.702ms  같은 정보를 백엔드의 로그창에서 뜨게한다  그래서 프론트에서 어떤 요청이 왔는지 알게되기 때문에 디버깅이 쉬워진다
const morgan = require('morgan');




//////////////////////////////////////////////////////////
//게시글 좋아요

//프론트/components/PostCard.js 에서  like 버튼에 대한 dispatch를 만들어보자

//위의 dispatch를 사용하는데 필요한 통신의 사가부분을 restAPI에 맞게 코딩하고 왠만하면 data를 같이 요청하지말자 



////////////////////////////////////////////////////////////
//게시글제거 / 닉네임 변경
//백엔드/routes/post.js 에서 게시글 삭제하는 시퀄라이즈부분 코드를 작성하고
//백엔드/routes/user.js 에서 닉네임을 수정하는 시퀄라이즈부분 코드를 작성해보자



/////////////////////////////////////////////////////////////
//팔로우 / 언팔로우
//백엔드/routes/user.js 에서 팔로우, 언팔로우처리하는 부분을 restAPI의 UPDATE, DELETE 를 사용하여 처리하고 이에 맞게 시퀄라이즈 사용하자

//프론트/pages/followList.js 에서  onCancel 부분을 고차함수를 사용하여 인자를 보내주자
// 팔로잉 제거는 근냥 리스트에서 아이디를 제거하면 되지만...
//팔로워 제거는 내가 팔로워 제거하는것이랑 그사람이 나를 제거하는거랑 같은 것이다.

//***  고차함수를 사용할때.. 프론트/postForm.js   에서 map 안의 콜백함수에 데이터를 넣고 싶다면 고차함수를 사용해야한다!!
{imagePaths.map((v, i) => (
    <div key={v} style={{ display: 'inline-block' }}>
      <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
      <div>
        <Button onClick={onRemoveImage(i)}>제거</Button>
      </div>
    </div>
  ))}


//////////////////////////////////////////////////////////////
//이미지 업로드를 위한 multer
//multer 미들웨어를 통해 이미지 업로드를 한다.
//백엔드/routes/post.js 에서  멀터의 파일을 저장할 코드를 작성한다.

//게시글 업로드 전에 이미지처리를 먼저하는 이유는... 이미지의 크기가 크기 때문에 이미지를 먼저 업로드를 한다
//(단점은... 이미지를 업로드하고... 게시글을 안올릴땐 이미지만 업로드 되어있다.. )
//(SNS는 이미지를 업로드하여 머신러닝이나 다른 측면으로 사용될 수 있기 때문에.. 이미지에 대한 용량이 중요하지 않게 생각한다 - SNS업체에선)

//프론트/postForm.js 에서  이미지 업로드를 위한 멀티파트를 사용하기 위해 FormData() 를 사용한다
const imageFormData = new FormData(); //FormData() 로 하면 멀티파트로 서버로 보낼 수 있다.
[].forEach.call(e.target.files, (f) => { //그냥 forEach() 를 사용할 수 없으므로 [] 밴배열의 forEach를 사용한다
  imageFormData.append('image', f);
});

//그리고 이에 맞는 프론트의 리듀서/사가 부분 코드를 작성하면 된다


////////////////////////////////////////////////////////////
//express.static 미들웨어
//express.static 미들웨어는 현재의 백폴더 경로처리를 위해 사용한다. 
//(윈도우, 맥, 리눅스 운영체제별로 경로처리 방법이 다르기 때문에 미들웨어 사용)
//(더 중요한 것은 서버의 폴더구조를 안보이게 하는 보안의 이점이 있기 때문에 사용한다)

//백엔드/routes/post.js 에서 아래와 같이 이미지의 경로가 복수일때 단수일때를 구분하여 처리해주자!!!
if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
    const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); //주소올리기
    await post.addImages(images);
  } else { // 이미지를 하나만 올리면 image: 제로초.png
    const image = await Image.create({ src: req.body.image });
    await post.addImages(image);
  }


////////////////////////////////////////////////////////////////
//해시태그 등록하기
//백엔드/routes/post.js 에서 게시글 올릴때 해시태그가 들어간 문자열을 찾는 정규표현식을 사용하여 해당문자열만 따로 구분하여 디비에 저장하자
const hashtags = req.body.content.match(/#[^\s#]+/g);

//그리고 해시태그가 있다면 아래와 같이 #노드 #노드 로 중복 등록한 경우의 수를 따져서 1개만 등록하도록 코드를 짠다
if (hashtags) {
    const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ //이렇게 해줘야 #노드 #노드 로 중복해도 1개만 등록된다
      where: { name: tag.slice(1).toLowerCase() },
    }))); // [[노드, true], [리액트, true]]   위의 result가 이런모양이기 때문에 아래에서 v[0] 으로 필요한 문자열만 빼준다
    await post.addHashtags(result.map((v) => v[0]));
  }


///////////////////////////////////////////////////////////////////
//리트윗하기

//백엔드/routes/post.js 에서 리트윗에 대한 조건을 코딩으로 해놨다. 
const retweetWithPrevPost = await Post.findOne({
    where: { id: retweet.id },
    include: [{
      model: Post,
      as: 'Retweet',
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }]
    }, {
      model: User,
      attributes: ['id', 'nickname'],
    }, {
      model: Image,
    }, {
      model: Comment, //지금은 괜찮지만..  너무 복잡해진다면.. 나중에 댓글부분은 따로 라우터를 분리해야 한다
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    }],
  })
// 위의 리트윗논리 이전에 조건들이 있다....

//프론트/PostCard.js 에서 리트윗글은 다른 방식으로 나타내보자
//*** 위의 파일에 아래의 코드를 넣어 경고창을 뜨게한다면... map으로 돌아가서 게시글의 갯수만큼 경고창이 뜬다..
//그래서 상위파일인 index.js 에 경고창을 뜨게하는 아래의 코드를 넣으면 경고창이 1번만 뜨는것을 확인할 수 있다
useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);


/////////////////////////////////////////////////////////////////////
//쿼리스트링과 lastId 방식
//프론트/index.js 에서 아래와 같이 mainPosts의 마지막 게시글아이디를 가져와서 아래와 같이 나타낸다
useEffect(() => {
    function onScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {    //hasMorePosts로 더 요청할지 구분을 한다
          const lastId = mainPosts[mainPosts.length - 1]?.id; //현재 나타난 mainPosts의 마지막 게시글 아이디
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

//hasMorePosts의 구분은 리듀서에서 아래와 같이 진행한다.
case LOAD_POSTS_SUCCESS:
    draft.loadPostsLoading = false;
    draft.loadPostsDone = true;
    draft.mainPosts = draft.mainPosts.concat(action.data);
    draft.hasMorePosts = action.data.length === 10;
//10개 보다 작을때 (10개불러오는게 최고이므로) 더 불러올필요가 없다.
