export const getTableColumns = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: 'ID',
          prop: 'id',
          width: 100,
        },
        {
          label: '日期',
          prop: 'date',
          width: 150,
        },
        {
          label: '姓名',
          prop: 'name',
          width: 150,
        },
        {
          label: '地址',
          prop: 'address',
          width: 200,
        },
        {
          label: '用户',
          width: 360,
          prop: 'user',
          children: [
            {
              label: '用户ID',
              width: 120,
              prop: 'user.id',
            },
            {
              label: '用户姓名',
              width: 120,
              prop: 'user.name',
            },
            {
              label: '用户年龄',
              width: 120,
              prop: 'user.age',
            },
          ],
        },
      ])
    }, 500)
  })
}

export const getColumnsData = (sreachParams: any) => {
  const { page, size } = sreachParams
  return new Promise((resolve, reject) => {
    let length = size
    const total = 500
    const startIndex = (page - 1) * size
    const endIndex = Math.min(startIndex + size, total)
    const currentPageSize = endIndex - startIndex

    setTimeout(() => {
      const res = {
        data: Array.from({ length: currentPageSize }).map((_, i) => {
          const globalIndex = startIndex + i
          return {
            id: Math.floor(Math.random() * 1000) + 1,
            date: `2021-${String((globalIndex % 12) + 1).padStart(2, '0')}-${String((globalIndex % 28) + 1).padStart(2, '0')}`,
            name: `张三${Math.random()}`,
            address: `北京市海淀区西二旗${globalIndex + 1}号`,
            user: {
              id: globalIndex + 1,
              name: `李${globalIndex + 1}`,
              age: globalIndex + 1,
            },
          }
        }),
        total: total,
      }
      resolve(res)
    },1000)
  })
}
