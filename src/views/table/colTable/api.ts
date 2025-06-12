import { da } from 'element-plus/es/locale/index.mjs'

export const getTableColumns = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: 'ID',
          prop: 'id',
          minWidth: 100,
        },
        {
          label: '日期',
          prop: 'date',
          minWidth: 150,
        },
        {
          label: '姓名',
          prop: 'name',
          minWidth: 150,
        },
        {
          label: '地址',
          prop: 'address',
          minWidth: 200,
        },
        {
          label: '用户',
          minWidth: 360,
          prop: 'user',
          children: [
            {
              label: '用户ID',
              minWidth: 120,
              prop: 'user.id',
            },
            {
              label: '用户姓名',
              minWidth: 120,
              prop: 'user.name',
            },
            {
              label: '用户年龄',
              minWidth: 120,
              prop: 'user.age',
            },
          ],
        },
        {
          label: '多等级',
          prop: 'level',
          minWidth: 150,
          children: [
            {
              label: '1-1级',
              prop: 'level.oneToOne',
              minWidth: 120,
              children: [
                {
                  label: '1-1-1级',
                  prop: 'level.oneToOne.oneToOne',
                  minWidth: 100,
                },
                {
                  label: '1-1-2级',
                  prop: 'level.oneToOne.oneToTwo',
                  minWidth: 100,
                },
              ],
            },
            {
              label: '1-2级',
              prop: 'level.oneToTwo',
              minWidth: 120,
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
            level: {
              oneToOne: {
                oneToOne: `1-1-1级${globalIndex + 1}`,
                oneToTwo: `1-1-2级${globalIndex + 1}`,
              },
              oneToTwo: `1-2级${globalIndex + 1}`,
            },
          }
        }),
        total: total,
      }

      resolve(res)
    }, 1000)
  })
}

/* 树型表格api请求 */
export const getTreeColumns = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          prop: 'name',
          label: '名称',
          // minWidth: '200px'
        },
        {
          prop: 'date',
          label: '日期',
          // minWidth: '200px'
        },
        {
          label: '地址',
          prop: 'address',
        },
      ])
    }, 800)
  })
}

export const getTreeData = (sreachParams: any) => {
  const { page, size } = sreachParams
  const total = 500
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const res = {
        data: Array.from({ length: size }).map((_, i) => {
          return {
            id: i,
            date: '2016-05-01',
            name: `${page}_葫芦娃_${i}`,
            address: `洛杉矶格罗夫街 189_${i} 号`,
            children:
              Math.random() > 0.5
                ? Array.from({ length: i + 1 }).map((_, _i) => {
                    return {
                      id: `${i}_${_i}`,
                      date: '2018-06-01',
                      name: `猪妖__${_i}`,
                      address: `浪浪山 666_${i} 号`,
                      hasChildren: Math.random() > 0.5,
                    }
                  })
                : undefined,
          }
        }),
        total: total,
      }
      resolve(res)
    }, 1000)
  })
}
