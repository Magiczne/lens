import { ValidationError } from 'yup'

import { LensRulesetError } from '@/errors'
import { Ruleset, RulesetValidator } from '@/typings/types'
import { rulesetSchema } from '@/validation/schemas'

export default class DefaultRulesetValidator implements RulesetValidator {
    async validate (ruleset: Record<string, unknown>, file: string): Promise<Ruleset> {
        try {
            return await rulesetSchema.validate(ruleset)
        } catch (e) {
            if (e instanceof ValidationError) {
                throw new LensRulesetError(e, file)
            }

            throw e
        }
    }
}
