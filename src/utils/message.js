import { Message, Notification } from 'element-ui'

/**
 * 封装Message
 * @param type 主体样式
 * @param message 文字
 */
export function handlerMessage(type = 'success', message = '操作成功') {
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
export function handlerNotification(title = '提示', message = '操作成功', type = 'success') {
  Notification({
    title,
    message,
    type
  })
}
