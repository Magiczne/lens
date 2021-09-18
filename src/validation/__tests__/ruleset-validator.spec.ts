import each from 'jest-each'

import { RulesetValidator } from '@/typings/rules'
import DefaultRulesetValidator from '@/validation/ruleset-validator'

describe('DefaultRulesetValidator', () => {
    let validator: RulesetValidator

    beforeEach(() => {
        validator = new DefaultRulesetValidator()
    })

    it('should return schema when input object is valid', async () => {
        const ruleset = {
            disable: false,
            rules: [{
                url: 'http://example.com',
                tag: 'tag',
                renderFor: [
                    { width: 1920, height: 1080 },
                    { width: 1280, height: 720 }
                ]
            }]
        }

        await expect(validator.validate(ruleset, 'ruleset.js'))
            .resolves
            .toStrictEqual(ruleset)
    })

    each([
        {
            rules: [{
                url: 'example.com',
                renderFor: [{ width: 1920, height: 1080 }]
            }]
        },
        {
            rules: [{
                url: 'ftp://example.com',
                renderFor: ['phone', 'tablet']
            }]
        },
        {
            rules: [{
                url: 'https://example.com'
            }]
        },
        {
            rules: [{
                url: 'https://example.com',
                renderFor: { foo: 'bar' }
            }]
        },
        {
            rules: [{
                url: 'https://example.com',
                async afterPageLoaded () {
                    return
                }
            }]
        }
    ]).it('should throw LensRulesetError when input is invalid', async (ruleset: Record<string, unknown>) => {
        await expect(validator.validate(ruleset, 'ruleset.js'))
            .rejects
            .toThrowErrorMatchingSnapshot()
    })
})
