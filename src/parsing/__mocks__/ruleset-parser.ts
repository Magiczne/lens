/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Viewport } from 'puppeteer'

import { Rule, Ruleset, ParsedRule, ParsedRuleset, RulesetParser } from '@/typings/rules'

export default class RulesetParserMock implements RulesetParser {
    parse (rawRuleset: Ruleset): ParsedRuleset {
        return {
            disable: false,
            rules: [{
                url: new URL('https://example.com'),
                tag: 'default',
                renderFor: {
                    default: [{ width: 1920, height: 1080 }]
                },
                async afterPageLoaded () {

                }
            }]
        }
    }

    parseRule (rule: Rule): ParsedRule {
        return {
            url: new URL('https://example.com'),
            tag: 'default',
            renderFor: {
                default: [{ width: 1920, height: 1080 }]
            },
            async afterPageLoaded () {

            }
        }
    }

    // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
    /**
     * Parse render for array.
     * If array contains strings return default viewports filtered by the key.
     * If array contains viewports, validate and return them.
     *
     * @param renderFor
     * @private
     */
    private parseRenderFor (renderFor?: Array<string> | Array<Viewport>): Record<string, Array<Viewport>> {
        return {
            default: [{ width: 1920, height: 1080 }]
        }
    }
}
