import request from '@/request/request'
export const test = () => {
  console.log('test')
}

export const getBigData = async () => {
  let data = []
  let start = 0
  let end = 20000
  for (start; start < end; start += 5000) {
    const chunnkData = await request.get('/getEchart', { start, end })
    data.push(...chunnkData)
  }
  return data
}

export const testData = async (start: number, end: number) => {
  return await request.get('/getEchart', { start, end })
}
