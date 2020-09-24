/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Ruleset, RulesetValidator } from '@/typings/rules'

export default class RulesetValidatorMock implements RulesetValidator {
    async validate (ruleset: Record<string, unknown>, file: string): Promise<Ruleset> {
        return new Promise((resolve) => {
            resolve({
                disable: false,
                rules: [{
                    url: 'https://example.com',
                    tag: 'default',
                    renderFor: [{ width: 1920, height: 1080 }],
                    async afterPageLoaded (): Promise<void> {

                    }
                }]
            })
        })
    }
}
