import DefaultRulesetParser from '@/parsing/ruleset-parser'
import { Rule, Ruleset, RulesetParser } from '@/typings/rules'
import { defaultViewports } from '@/viewports'

describe('DefaultRulesetParser', () => {
    const afterPageLoaded = async () => { console.log('After page loaded') }
    let parser: RulesetParser

    beforeEach(() => {
        parser = new DefaultRulesetParser()
    })

    describe('parseRule', () => {
        it('should return correctly parsed rule when renderFor is undefined', () => {
            const rule: Rule = {
                url: 'https://example.com',
                tag: 'tag',
                afterPageLoaded: afterPageLoaded
            }

            expect(parser.parseRule(rule)).toStrictEqual({
                url: new URL(rule.url),
                tag: rule.tag,
                renderFor: defaultViewports,
                afterPageLoaded: afterPageLoaded
            })
        })

        it('should return correctly parsed rule when renderFor is an array of strings', () => {
            const rule: Rule = {
                url: 'https://example.com',
                tag: 'tag',
                renderFor: ['desktop', 'tablet', 'phone'],
                afterPageLoaded: afterPageLoaded
            }

            expect(parser.parseRule(rule)).toStrictEqual({
                url: new URL(rule.url),
                tag: rule.tag,
                renderFor: defaultViewports,
                afterPageLoaded: afterPageLoaded
            })
        })

        it('should return correctly parsed tule when renderFor is an array of viewports', () => {
            const rule: Rule = {
                url: 'https://example.com',
                tag: 'tag',
                renderFor: [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }],
                afterPageLoaded: afterPageLoaded
            }

            expect(parser.parseRule(rule)).toStrictEqual({
                url: new URL(rule.url),
                tag: rule.tag,
                renderFor: {
                    default: [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }]
                },
                afterPageLoaded: afterPageLoaded
            })
        })
    })

    describe('parse', () => {
        it('should return correctly parsed ruleset', () => {
            const rule = {
                url: 'https://example.com',
                tag: 'tag',
                renderFor: [{ width: 1920, height: 1080 }, { width: 1280, height: 720 }],
                afterPageLoaded: afterPageLoaded
            }

            const ruleset: Ruleset = {
                disable: true,
                rules: [rule]
            }

            expect(parser.parse(ruleset)).toStrictEqual({
                disable: true,
                rules: [parser.parseRule(rule)]
            })
        })

        it('should return correctly parsed ruleset when disable flag is undefined', () => {
            const ruleset: Ruleset = {
                rules: []
            }

            expect(parser.parse(ruleset)).toStrictEqual({
                disable: false,
                rules: []
            })
        })
    })
})
