/**
 * 接口服务统计
 * @author barret
 * @data 2018/04/15
 */
import {get, post} from '../untils/HttpTool';

export const getUser = async ({userName, pass}) => {
    const url = '/getUser';
    const params = {
        userName,
        pass,
    }
    return await get({url, params}).then(res => res.json());
}