/**
 * todoList首页
 * @author barret
 * @data 2018/04/15
 */
import './home.less';

import React from 'react';
import { List, Checkbox, InputItem, Flex, Button } from 'antd-mobile';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import { getUser } from '../../service/index';

class Index extends React.Component {
    state = {
        taskName: ''
    }

    async componentDidMount() {
        //请求用户信息
        const userInfo = await getUser({
            userName: '999',
            pass: 666
        });
        console.log(userInfo);
    }

    taskNameFn = (val) => {
        this.setState({
            taskName: val,
        })
    }

    changeTaskStatus = (taskName) => {
        this.props.TaskStore.changeTodoTaskStatus(taskName)
    }

    addTask = () => {
        const {taskName} = this.state;
        if (taskName) {
            this.props.TaskStore.addTodoTask(taskName);
            this.setState({
                taskName: '',
            })
        }
    }

    render() {
        const {taskName} = this.state;
        return (
          <div className="todo-list-wrap">
            <Flex className="task-sum">
              <Flex.Item>
                <div className="sum-title">待做事项数</div>
                <div className="sum-num">{this.props.TaskStore.noDoneTaskList.length}</div>
              </Flex.Item>
              <Flex.Item>
                <div className="sum-title">已经完成事项数</div>
                <div className="sum-num">{this.props.TaskStore.doneTaskList.length}</div>
              </Flex.Item>
            </Flex>
            <List renderHeader={() => '添加事项'}>
              <InputItem
                clear
                value={taskName}
                onChange={this.taskNameFn}
              >
                  事项名称：
              </InputItem>
              <List.Item>
                <Button
                  className="add-task-btn"
                  onClick={this.addTask}
                >
                  添加到事项列表
                </Button>
              </List.Item>
            </List>
            <List renderHeader={() => '事项列表'}>
              {
                  this.props.TaskStore.todoList && this.props.TaskStore.todoList.map((info, i) => {
                      return (
                        <Checkbox.CheckboxItem key={i} checked={info.done} onChange={() => this.changeTaskStatus(info.taskName)}>
                          <span className={info.done?"task-done": ""}>{info.taskName}</span>
                        </Checkbox.CheckboxItem>
                      )
                  })
              }
            </List>
          </div>
        )
    }
}

Index.propTypes = {
    TaskStore: PropTypes.string.isRequired,
}

export default inject("TaskStore")(observer(Index));