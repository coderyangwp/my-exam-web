import request from '@/utils/request'

export function saveExamInfo(data){
    return request({
        url: '/exam/saveExamInfo',
        data: data,
        method: 'post'
    })
}