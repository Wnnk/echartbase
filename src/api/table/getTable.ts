import { reject } from "lodash"

export interface User {
  date: string
  id: number
  name: string
  address: {
    street: string
    city: string
    state: string
  }
  age: number
}
const tableData: User[] = [
  {
    id: 1,
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: {
      street: '3344 Oakridge Drive',
      city: 'South Jessieville',
      state: 'New Jersey',
    },
    age: 25,
  },
  {
    id: 2,
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: {
      street: '4428 Woodside Circle',
      city: 'East Jessicaburgh',
      state: 'New Jersey',
    },
    age: 32,
  },
  {
    id: 3,
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: {
      street: '3669 Williams Court',
      city: 'New Joshuatown',
      state: 'New Jersey',
    },
    age: 28,
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Margie Smith',
    address: {
      street: '4166 Williams Avenue',
      city: 'West Joshuashire',
      state: 'New Jersey',
    },
    age: 36,
  },
]

export const getTable = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tableData)
    }, 200)
  })
}

export const updateTable = (data: User[]): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 200)
  })
}


export interface Equipment {
  equipmentName: string
  equipmentId: string
  temperature: number
  humidity: number
  pressure: number
  address:{
    street: string
    city: string
    state: string
  }
}

export const createTabledata = (start: number, end: number):  Promise<{data: Equipment[], count: number}> => {
  const data: Equipment[] = [];
  for (; start < end; start++) {
    data.push({
      equipmentName: `equipment${start}`,
      equipmentId: `${start}`,
      temperature: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 100),
      pressure: Math.floor(Math.random() * 100),
      address: {
        street: `street${start}`,
        city: `city${start}`,
        state: `state${start}`
      }
    })
  }
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve({data, count: 200})
      // reject()
      // resolve({data:[],count:0})
    }, 2000)
  })
}


