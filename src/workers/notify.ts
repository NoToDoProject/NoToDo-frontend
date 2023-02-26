/**
 * notify 提醒worker
 */
export { }
const notifyList: list[] = []
// notifyList的id和定时器的map表
const timerMap = new Map()

self.onmessage = function (e) {
    const { type, data } = e.data
    console.log(type, data)
    if (type === 'init') {
        notifyList.push(...data)
        // 根据notification的通知时间设置定时器
        notifyList.forEach((item) => {
            const { id, notification } = item
            const now = new Date().getTime()
            const diff = notification! - now
            if (diff > 0) {
                timerMap.set(id, setTimeout(() => {
                    // 直接发送通知
                    new Notification('代办提醒', {
                        body: "您设置的 " + data.value + " 的提醒时间到了"
                    })
                    // 发送信息回去让主线程删notification
                    self.postMessage({
                        type: 'notified',
                        data: {
                            id: data.id
                        }
                    })
                }, diff))
                console.log("定时器设置成功将在" + new Date(notification!).toLocaleString() + "发送通知")
            }
        })
    } else if (type === 'add') {
        // 先判断map表中是否有该id的定时器，如果有则清除
        if (timerMap.has(data.id)) {
            clearTimeout(timerMap.get(data.id))
            // 并且更新list的表
            notifyList.forEach((item) => {
                if (item.id === data.id) {
                    item = data
                }
            })
        } else {
            // 如果没有则直接添加
            notifyList.push(data)
        }
        // 设置定时器
        const { id, notification } = data
        const now = new Date().getTime()
        const diff = notification! - now
        if (diff > 0) {
            timerMap.set(id, setTimeout(() => {
                // 直接发送通知
                new Notification('代办提醒', {
                    body: "您设置的 " + data.value + " 的提醒时间到了"
                })
                // 发送信息回去让主线程删notification
                self.postMessage({
                    type: 'notified',
                    data: {
                        id: data.id
                    }
                })
            }, diff))
            console.log("定时器设置成功将在" + new Date(notification!).toLocaleString() + "发送通知")
        }
    } else if (type === 'remove') {
        // 删除list中的数据
        notifyList.forEach((item, index) => {
            if (item.id === data.id) {
                notifyList.splice(index, 1)
            }
        })
        // 清除定时器
        clearTimeout(timerMap.get(data.id))
    }
}