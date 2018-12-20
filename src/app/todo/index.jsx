/**
 * 移动办公模块入口
 */
import React from 'react';
import ReactDOM from 'react-dom';

// 引入React-Router模块
import { HashRouter as Router, Route } from 'react-router-dom';

import {Provider} from 'mobx-react';
import TodoHomeContainer from 'bundle-loader?lazy&name=app.[name]!./home.jsx';
import store from './store';

// bundle模型用来异步加载组件
import Bundle from '../../bundle';


const TodoHome = () => (
  <Bundle load={TodoHomeContainer}>
    {(TodoHome) => <TodoHome />}
  </Bundle>
)

const Init = () => (
  <Router>
    <Provider {...store}>
      {/*todo首页*/}
      <Route exact path="/" component={TodoHome} />
    </Provider>
  </Router>
)

ReactDOM.render((
  <Init />
), document.querySelector('#init'), () => {
})