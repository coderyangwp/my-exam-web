import request from '@/utils/request'

/**
 * 考试列表
 * @returns 
 */
export function examList(examDto) {
    return request({
        url: '/exam/list',
        method: 'get',
        params: examDto
    })
}
/**
 * 新增/编辑考试信息
 * @param data 
 * @returns 
 */
export function saveExamInfo(data){
    return request({
        url: '/exam/saveExamInfo',
        data: data,
        method: 'post'
    })
}
