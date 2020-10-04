import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';

import wrapper from '../store/configureStore';

const NodeBird = ({ Component }) => {
  return (
    <>
    {/* 기존에 여기서 <provider stroe={}></provider> 이런식으로 감쌌는데... next6버전부턴... 감쌀 필요가 없어졌다
    오히려 감싸면 에러가 발생한다 */}
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

export default wrapper.withRedux(NodeBird);
