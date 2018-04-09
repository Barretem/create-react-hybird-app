/**
 * todoList 事件列表
 * @author barret007
 * @data 2018/03/24
 */
import {action, observable, computed} from 'mobx';

class TaskStore {
    @observable todoList = [
        {
            taskName: '吃饭',
            done: false,
        },
        {
            taskName: '睡觉',
            done: false,
        },
        {
            taskName: '打豆豆',
            done: true,
        },
    ]; //事项列表

    @action
    //新增待做事项
    addTodoTask = (taskName) => {
        this.todoList.push({
            taskName,
            done: false
        })
    }

    @action
    //更改待做事件状态
    changeTodoTaskStatus = (taskName) => {
        this.todoList.map((info, i) => {
            if(info.taskName == taskName) {
                this.todoList[i] = {
                    ...info,
                    done: !info.done,
                }
            }
        })
    }

    @computed
    //获取已经完成的的事项
    get doneTaskList() {
        return this.todoList.filter(info => info.done)
    }
    @computed
    //获取待做事项
    get noDoneTaskList() {
        return this.todoList.filter(info => !info.done)
    }
}

export default new TaskStore();