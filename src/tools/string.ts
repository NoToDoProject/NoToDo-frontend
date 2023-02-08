export const safeHtml = (html: string, strict?: boolean): string => {
    // 删除script标签及其内容
    const value = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/g, '')
    // 如果是严格模式，则删除所有标签
    if (strict) {
        return value.replace(/<[^>]+>/g, '')
    }
    return html
}

// 日期描述
export const dateDescription = (date: number): string => {
    const now = new Date().getTime()
    const diff = now - date
    /**
     * 如果差异在一天之内，则根据差异的大小返回x小时之前，x分钟之前，x秒之前，否则输出具体日期，
     */
    if (diff < 86400000) {
        if (diff < 3600000) {
            if (diff < 60000) {
                return `${Math.floor(diff / 1000)}秒前`
            }
            return `${Math.floor(diff / 60000)}分钟前`
        }
        return `${Math.floor(diff / 3600000)}小时前`
    }
    // 如果是昨天
    if (new Date(now).getDate() - new Date(date).getDate() === 1) {
        return '昨天'
    }
    // 返回具体日期，时分秒
    const time = new Date(date)
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}