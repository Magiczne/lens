import { isStringArray } from '@/util'

describe('isStringArray', () => {
    it('returns true when array consists only of strings', () => {
        const arr = ['a', 'b', 'c']

        expect(isStringArray(arr)).toBe(true)
    })

    it('returns false when array contains element of another type', () => {
        const arr = ['a', 'b', 10]

        expect(isStringArray(arr)).toBe(false)
    })
})
