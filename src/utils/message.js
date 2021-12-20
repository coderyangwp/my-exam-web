import { Message, Notification, MessageBox } from 'element-ui'

/**
 * 封装Message
 * @param type 主体样式
 * @param message 文字
 */
export function myMessage(type = 'success', message = '操作成功') {
  Message({
    type,
    message
  })
}

/**
 * 封装Notification
 * @param title 标题
 * @param message 说明文字
 * @param type 主体样式
 */
export function myNotice(title = '提示', message = '操作成功', type = 'success') {
  Notification({
    title,
    message,
    type
  })
}

/**
 * 封装MessageBox
 * @param content 提示内容
 * @returns {Promise<MessageBoxData>}
 */
export function myConfirm(content) {
  return MessageBox.confirm(content, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
