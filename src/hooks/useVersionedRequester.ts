class VersionedRequester {
  lastVersion: number
  pendingRequests: Map<symbol, number>
  constructor() {
    this.lastVersion = 0
    this.pendingRequests = new Map()
  }

  async sendRequest(requestFn: () => Promise<any>) {
    const version = ++this.lastVersion
    const requestId = Symbol(`request-${version}`)
    this.pendingRequests.set(requestId, version)
    try {
      const result = await requestFn()
      if (this.isLatestRequest(requestId)) {
        this.pendingRequests.delete(requestId)
        return result
      }
      return null
    } catch (error) {
      this.pendingRequests.delete(requestId)
      throw error
    }
  }

  isLatestRequest(requestId: symbol) {
    const requestVersion = this.pendingRequests.get(requestId)
    return requestVersion === this.lastVersion
  }
}
