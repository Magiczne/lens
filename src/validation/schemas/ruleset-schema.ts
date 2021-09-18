import * as Yup from 'yup'
import { Ruleset } from '@/typings/rules'

import { ruleSchema } from '@/validation/schemas/rule-schema'

const rulesetSchema: Yup.SchemaOf<Ruleset> = Yup.object().shape({
    disable: Yup.bool().default(false),
    rules: Yup.array().of(ruleSchema).required().min(1)
}).required()

export {
    rulesetSchema
}
