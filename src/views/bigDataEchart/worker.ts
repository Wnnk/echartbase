import axios from "axios";

self.onmessage = (e) => {
  let {  type } = e.data
  switch (type) {
    case 'init':
      requestData('http://localhost:3000/api/getBigData')
      break
    default:
      break
  }
}

const requestData = async (url: string) => { 
  const response = await axios({
    method: 'get',
    url
  })
  if(response.data.code === 2000) {
    const data = response.data.data
    InitHandlerOption(data)
  }
}


const InitHandlerOption = (data: any) => {
  const chunkSize = 2000;
  const chunkArray = []
  for(let i = 0; i < data.length; i++) {
    chunkArray.push([data[i].time, data[i].value])
  }
  for(let i = 0; i < data.length; i += chunkSize) {
    const chunk = chunkArray.slice(i, i + chunkSize);
    self.postMessage({
      chunk,
      type: `${i === 0? 'init' : 'chunk'}`,
      done: i + chunkSize >= data.length,
    });
  }
}


