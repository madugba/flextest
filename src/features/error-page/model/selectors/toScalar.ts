export function toScalar(param: string | string[] | undefined): string | undefined {
  if (param === undefined) return undefined
  return Array.isArray(param) ? param[0] : param
}
