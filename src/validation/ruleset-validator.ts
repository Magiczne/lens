import { ValidationError } from 'yup'

import { LensRulesetError } from '@/errors'
import { Ruleset, RulesetValidator } from '@/typings/types'
import { rulesetSchema } from '@/validation/schemas/ruleset-schema'

export default class DefaultRulesetValidator implements RulesetValidator {
    async validate (ruleset: Record<string, unknown>, file: string): Promise<Ruleset> {
        try {
            // In that we we make sure we have the cleanest return type that is possible
            // as yup will force to create some weird typings...
            return await rulesetSchema.validate(ruleset) as Ruleset
        } catch (e) {
            if (e instanceof ValidationError) {
                throw new LensRulesetError(e, file)
            }

            throw e
        }
    }
}
