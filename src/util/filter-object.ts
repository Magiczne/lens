/**
 * Filter object by including only specified keys in the return value
 *
 * @param obj Object to be filtered
 * @param keys Object keys to be included in the return value
 * @return Filtered object
 */
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
