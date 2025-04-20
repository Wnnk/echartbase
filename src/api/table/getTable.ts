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
