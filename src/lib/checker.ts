import zxcvbn from "zxcvbn"

export function getPasswordStrength(password: string, userInputs?: string[]): zxcvbn.ZXCVBNResult {
  return zxcvbn(password, userInputs)
}