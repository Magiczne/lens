import { Page, Viewport } from 'puppeteer'
import { ViewportType } from '@/viewports'

interface Rule {
    url: string
    tag: string
    renderFor?: Array<ViewportType> | Array<Viewport>

    afterPageLoaded?: (page: Page) => Promise<void> | void
}

interface ParsedRule {
    url: URL
    tag: string
    renderFor: Record<string, Array<Viewport>>

    afterPageLoaded?: (page: Page) => Promise<void> | void
}

interface Ruleset {
    disable?: boolean
    rules: Array<Rule>
}

interface ParsedRuleset {
    disable: boolean
    rules: Array<ParsedRule>
}

interface RulesetParser {
    /**
     * Parse set of rules for further use in the application.
     *
     * @param rawRuleset Raw ruleset data from file
     * @return Parsed ruleset data
     */
    parse (rawRuleset: Ruleset): ParsedRuleset

    /**
     * Parse single rule for further use in the application.
     *
     * @param rule Raw rule data from ruleset file
     * @return Parsed rule data
     */
    parseRule (rule: Rule): ParsedRule
}

interface RulesetValidator {
    validate (ruleset: Record<string, unknown>, file: string): Promise<Ruleset> | Ruleset
}

export {
    Rule, Ruleset,
    ParsedRule, ParsedRuleset,
    RulesetParser, RulesetValidator
}
