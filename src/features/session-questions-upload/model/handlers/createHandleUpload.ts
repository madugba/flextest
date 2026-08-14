interface UploadRouter {
  push: (href: string) => void
}

export function createHandleUpload(
  router: UploadRouter,
  sessionId: string
): (subjectId: string) => void {
  return (subjectId: string) => {
    router.push(`/questions/upload/${sessionId}/${subjectId}`)
  }
}
