import React from 'react';
import Head from 'next/head'; //next는 head 컴포넌트를 제공하기 때문에... HEAD를 건들고 싶다면 이렇게 적용을 시키자
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';  //이걸로 엔트디를 적용시킨다

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default NodeBird;
