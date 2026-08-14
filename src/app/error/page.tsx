import { ErrorPage } from '@/features/error-page'

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return <ErrorPage searchParams={params ?? {}} />
}
