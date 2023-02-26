type step = {
    key: string,
    value: string,
    isFinished?: boolean,
}

enum repeat {
    once = 1,
    weekday = 2,
    weekend = 3,
}

type list = {
    id: string,
    key: string,
    value: string,
    steps?: step[],
    notification?: number,
    repeat?: number | string | repeat,
    isFinished?: boolean,
    description?: string,
    file?: string,
    originMyDay?: boolean,
    originImportant?: boolean,
    originPlan?: boolean,
    isMyDay?: boolean,
    isImportant?: boolean,
    isPlan?: boolean,
    creatTime: number,
}