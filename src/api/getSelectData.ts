import request from "@/request/request"
export const getSelectData = async (url: string, start:number, end:number) => {
  const res = await request.get(url,{
    start,
    end
  })
  return res
}