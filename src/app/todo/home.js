/**
 * todoList首页
 * @author barret
 * @data 2018/04/15
 */
import './home.less';

import React, {Component} from 'react';
import { List, Checkbox, InputItem, Flex} from 'antd-mobile';

import {observer, inject} from 'mobx-react';
import {getUser} from '../../service/index';

const CheckboxItem = Checkbox.CheckboxItem;

class Index extends Component {
    state = {
        taskName: ''
    }

    //
    taskNameFn = (val) => {
        this.setState({
            taskName: val,
        })
    }

    //
    changeTaskStatus = (taskName) => {
        this.props.TaskStore.changeTodoTaskStatus(taskName)
    }

    async componentDidMount() {
        //请求用户信息
        const userInfo = await getUser({
            userName: '999',
            pass: 666
        })
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
                    >事项名称：</InputItem>
                    <List.Item>
                        <div
                            className="add-task-btn"
                            onClick={() => {
                                taskName ? this.props.TaskStore.addTodoTask && this.props.TaskStore.addTodoTask(taskName): '';
                                this.setState({
                                    taskName: '',
                                })
                            }}
                        >
                            添加到事项列表
                        </div>
                    </List.Item>
                </List>
                <List renderHeader={() => '事项列表'}>
                    {this.props.TaskStore.todoList && this.props.TaskStore.todoList.map((info, i) => (
                        <CheckboxItem key={i} checked={info.done} onChange={() => this.changeTaskStatus(info.taskName)}>
                            <span className={info.done?"task-done": ""}>{info.taskName}</span>
                        </CheckboxItem>
                    ))}
                </List>
            </div>
        )
    }
}

export default inject("TaskStore")(observer(Index));