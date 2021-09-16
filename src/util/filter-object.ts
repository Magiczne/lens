const filterObject = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: ReadonlyArray<K>): Pick<T, K> => {
    return (Object.keys(obj) as Array<K>)
        .filter(key => keys.includes(key))
        .reduce((ret, key) => {
            return Object.assign(ret, {
                [key]: obj[key]
            })
        }, {}) as Pick<T, K>
}

export {
    filterObject
}
