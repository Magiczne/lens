import { filterObject } from '@/util'

describe('filterObject', () => {
    it('filters object', () => {
        const obj = {
            a: 10,
            b: 'test',
            c: {
                d: 15
            }
        }

        const filteredObj = filterObject(obj, ['a', 'c'])

        expect(filteredObj).toStrictEqual({
            a: 10,
            c: {
                d: 15
            }
        })
    })
})
