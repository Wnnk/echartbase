import request from '@/request/request'

export const getMoreData = async () => {
  const res = await request.get('/getMoreData')
  return res
}
