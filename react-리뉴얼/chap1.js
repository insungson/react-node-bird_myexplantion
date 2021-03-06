//1. 작업방법

//SSR 방법         포트가 다르기 떄문에 CORS 설정을 해야한다(프론트-백엔드 시 필수!!)
// 브라우저           프론트 서버             백엔드 서버             데이터베이스
//          ------->            ------------>           ----------->
//          /blog                 /posts             실제 게시글데이터 요청
//          <------             <------------           <-----------

//1. 브라우저에서 프론트서버로 /blog라는 페이지를 요청
//2. 프론트 서버는 백엔드 서버로 블로그들의 게시글인 /posts를 요청한다
//3. 데이터베이스는 백엔드서버로 데이터 전달,  백엔드는 프론트로 데이터 전달
//4. 프론트서버는 HTML CSS를 조합하여 브라우저로 화면과 정보를 전달

//리엑트는 싱글페이지이므로... 하나의 페이지에서 화면만 바뀌는것처럼 보이게 한다



//SPA 방식(CSR)
//브라우저          프론트 서버            백엔드 서버              데이터베이스
//        --------->   
//        /blog     
//        <---------   
// 화면로딩
//        ------------------------------>           -------------->
//                    /posts                          게시글데이터 요청
//        <-----------------------------            <--------------
// 화면로딩 없앰

//1. 브라우저에서 프론트 서버로 /blog 페이지 요청
//2. 프론트 서버는 브라우저로 /posts 화면을 빌드, 그동안 화면에는 로딩을 띄움!!
//3. 브라우저는 백엔드 서버로 데이터를 요청!, 데이터베이스를 거쳐 데이터가져옴
//4. 백엔드에서 브라우저로 데이터를 보낼땐 로딩화면을 없애고 화면에 데이터를 넣는다


//SSR의 장점
//1. 한방에 다 보여주기 때문에.. 처음 로딩이 오래걸리지만... 로딩 후 화면전환이 빠르다
//2. 
//CSR의 장점
//1. 빠른 로딩시간 

//** 첫방문만 SSR로 이후는 SCR로 페이지간 전환을 해본다
// NEXT를 사용하는 경우!!
//B2C 같은 빠른 화면전환이 필요한 경우(SSR, CSR 동시 적용 가능시)
//ADMIN 페이지는 NEXT없이 리엑트를 사용해서 만들어도 된다


//