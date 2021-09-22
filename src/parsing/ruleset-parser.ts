import type { Viewport } from 'puppeteer'

import type { Rule, Ruleset, ParsedRule, ParsedRuleset, RulesetParser } from '@/typings/rules'
import { filterObject, isStringArray } from '@/util'
import { defaultViewports, ViewportType } from '@/viewports'

export default class DefaultRulesetParser implements RulesetParser {
    /**
     * @inheritDoc
     */
    parse (rawRuleset: Ruleset): ParsedRuleset {
        return {
            disable: rawRuleset.disable !== undefined ? rawRuleset.disable : false,
            rules: rawRuleset.rules.map(rule => this.parseRule(rule))
        }
    }

    /**
     * @inheritDoc
     */
    parseRule (rule: Rule): ParsedRule {
        return {
            url: new URL(rule.url),
            tag: rule.tag,
            renderFor: DefaultRulesetParser.parseRenderFor(rule.renderFor),
            afterPageLoaded: rule.afterPageLoaded
        }
    }

    /**
     * Parse render for array.
     * If array contains list of viewport types return default viewports filtered by the type.
     * If array contains viewports just return them, as they should be validated by the ruleset validator.
     *
     * @param renderFor List of viewport types or viewports to be parsed
     * @return Dictionary of parsed viewports
     */
    private static parseRenderFor (renderFor?: Array<ViewportType> | Array<Viewport>): Record<string, Array<Viewport>> {
        if (!renderFor) {
            return defaultViewports
        }

        if (isStringArray(renderFor)) {
            return filterObject(defaultViewports, renderFor)
        } else {
            return {
                default: renderFor as Array<Viewport>
            }
        }
    }
}
