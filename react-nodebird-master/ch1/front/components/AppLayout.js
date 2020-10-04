import React from 'react';
import Link from 'next/link';
import { Menu, Input, Button } from 'antd';
import PropTypes from 'prop-types';

const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
      {/* 아래의 Link 기능은 리엑트 핫로더로 next에는 이기능이 알아서 적용된다 */}
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
      </Menu>
      <Link href="/signup">
        <a><Button>회원가입</Button></a>
      </Link>
      {children}
    </div>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout;
