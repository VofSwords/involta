export interface GetFeed {
  (): Promise<NewsItem[]>
}

export interface NewsProvider {
  getFeed: GetFeed
}
