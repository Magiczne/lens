import { Viewport } from 'puppeteer'

import { Rule, Ruleset, ParsedRule, ParsedRuleset, RulesetParser } from '@/typings/rules'
import { filterObject, isStringArray } from '@/util'
import { defaultViewports } from '@/viewports'

export default class DefaultRulesetParser implements RulesetParser {
    parse (rawRuleset: Ruleset): ParsedRuleset {
        return {
            disable: rawRuleset.disable !== undefined ? rawRuleset.disable : false,
            rules: rawRuleset.rules.map(rule => this.parseRule(rule))
        }
    }

    parseRule (rule: Rule): ParsedRule {
        return {
            url: new URL(rule.url),
            tag: rule.tag,
            renderFor: this.parseRenderFor(rule.renderFor),
            afterPageLoaded: rule.afterPageLoaded
        }
    }

    /**
     * Parse render for array.
     * If array contains strings return default viewports filtered by the key.
     * If array contains viewports, validate and return them.
     *
     * @param renderFor
     * @private
     */
    private parseRenderFor (renderFor?: Array<string> | Array<Viewport>): Record<string, Array<Viewport>> {
        if (!renderFor) {
            return defaultViewports
        }

        if (isStringArray(renderFor)) {
            return filterObject(defaultViewports, renderFor as Array<string>)
        } else {
            return {
                default: renderFor as Array<Viewport>
            }
        }
    }
}
