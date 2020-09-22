import { Page, Viewport } from 'puppeteer'

interface Rule {
    url: string
    tag: string
    renderFor?: Array<string> | Array<Viewport>

    afterPageLoaded?: (page: Page) => Promise<void> | void
}

interface ParsedRule {
    url: URL
    tag: string
    renderFor: Record<string, Array<Viewport>>

    afterPageLoaded?: (page: Page) => Promise<void> | void
}

interface Ruleset {
    disable: boolean
    rules: Array<Rule>
}

interface ParsedRuleset {
    disable: boolean
    rules: Array<ParsedRule>
}

interface RulesetParser {
    parse (rawRuleset: Ruleset): ParsedRuleset

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
