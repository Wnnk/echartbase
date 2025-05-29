<!-- 
  @description: xlsx 下载问题
-->

<template>
  <div>
    <el-table
      ref="tableRef"
      :data="tableData"
      @selection-change="handleSelectionChange"
      v-loading="status === 1"
      v-if="status !== 3"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="expand" width="55"></el-table-column>
      <el-table-column fixed="left" label="id" width="100" prop="id"> </el-table-column>
      <el-table-column fixed="left" label="日期" prop="date" width="150"> </el-table-column>
      <el-table-column label="配送信息">
        <el-table-column prop="name" label="姓名" width="120" align="left"></el-table-column>
        <el-table-column prop="province" label="省份" width="120" align="center"></el-table-column>
        <el-table-column prop="city" label="城市" width="240" align="right"></el-table-column>
        <el-table-column prop="area" label="区县" width="120"></el-table-column>
        <el-table-column prop="address" label="地址" width="200"></el-table-column>
        <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
      </el-table-column>

      <el-table-column prop="diff" label="差价" width="100"></el-table-column>

      <el-table-column label="标签" width="100">
        <template #default="scope">
          <el-tag type="success">标签</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" >
        <template #default="scope">
          <el-button size="small">查看</el-button>
          <el-button size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="status === 3" type="primary" @click="api(currentPage)">重试</el-button>
    <el-pagination
      background
      layout="total,size , prev, pager, next"
      :total="total"
      :page-size="5"
      v-model:current-page="currentPage"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>

  <el-button @click="downloadExcel('table', 'table', selectionData)">本页download</el-button>
  <el-button @click="downloadExcel('table', 'table', allTableData)">全部download</el-button>

</template>

<script setup lang="ts">
import { computed, h, nextTick, onMounted, ref } from 'vue'
// import * as XLSX from 'xlsx'
import * as XLSX from "xlsx-js-style";
import { getXlsxData, getAllData } from './xlsxData'


/* 表格 */
const tableRef = ref()
const status = ref(0)
const tableData: any = ref()
let allTableData: any = []
/* 勾选 */
const selectionData = ref([])
/* 分页 */
const total = ref(0)
const currentPage = ref(1)

const handleSelectionChange = (selection: any) => {
  selectionData.value = selection
}

const api = async (page: number) => {
  try {
    status.value = 1
    const res = (await getXlsxData((page - 1) * 5, 5)) as any
    tableData.value = res.data
    total.value = res.total
    currentPage.value = res.page
    status.value = 2
  } catch (error) {
    status.value = 3
  }
}
api(1)

const currentChange = async (page: number) => {
  await api(page)
}
/**
 * @description: 获取全部数据，用于下载不显示UI
 *
 */
const getAllTableData = async () => {
  try {
    const res = (await getAllData()) as any
    allTableData = res.data
    return
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getAllTableData()
})

/**
 * @description: 根据table实例表头，转为结构化数据
 * @returns {any[]} 结构化数据
 */
const getTableData = (excludeLabel: string[] = []): any[] => {
  /* 1.将实例的一级表头转为结构化数据 */
  const headers = tableRef.value.columns
    .filter((col: any) => col.type !== 'selection' && col.type !== 'expand' && !excludeLabel.includes(col.label)) // Skip selection columns
    .map((col: any) => {
      return {
        label: col.label,
        children: col.children || [],
        prop: col.property,
        width: col.width,
        algin: col.align ?? 'is-left',
      }
    })
    
  /* 2.将递归转为结构化数据 */
  const toData = (headers: any[]) => {
    let result: any[] = []
    headers.forEach((header: any) => {
      if (
        header.hasOwnProperty('children') &&
        Array.isArray(header.children) &&
        header.children.length > 0
      ) {
        result.push({
          label: header.label,
          children: toData(header.children),
          align: header.align ?? 'is-left',
        })
      } else {
        result.push({
          label: header.label,
          prop: header.prop || header.property,
          width: header.width,
          align: header.align ?? 'is-left',
        })
      }
    })
    return result
  }
  const tableHeader = toData(headers)
  return tableHeader
}

const downloadExcel = (sheetName: string, fileName: string, selectionData: any = []) => {
  /* 获取表头数据 */
  const tableHeader = getTableData(['标签', '操作'])
  const excelHeader = buildHeader(tableHeader)
  /* 获取表头行数 */
  const headerRows = excelHeader.length

  /* 获取表体数据 */
  let dataList = extracData(selectionData, tableHeader)
  excelHeader.push(...dataList, [])
  let merges = doMerges(excelHeader)
  let ws = aoa_to_sheet(excelHeader, headerRows)
 
  /* 合并单元格 */
  ws['!merges'] = merges
  /* 冻结 */
  ws['!freeze'] = {
    xSplit: '1',
    ySplit: '' + headerRows,
    topLeftCell: 'B' + (headerRows + 1),
    activePane: 'bottomRight',
    state: 'frozen',
  }
  /* 设置列宽 */
  const headerStyle = getHeaderStyle(tableHeader)
  ws['!cols'] = headerStyle.map((style) => ({ wpx: style.width}))
  /* 设置align */
  ws = setHeaderAlign(headerStyle, ws)

 

  

  let workbook: XLSX.WorkBook = {
    SheetNames: [sheetName],
    Sheets: {},
  }
  workbook.Sheets[sheetName] = ws
  return XLSX.writeFile(workbook, fileName + '.xlsx', {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true,
  })
}

/**
 * @description:构建表头
 * @param {any[]} data 表头数据
 * @return {any[]} excel表格展示的表头
 */
const buildHeader = (data: any[]) => {
  let excelHeader: any[] = []
  getHeader(data, excelHeader, 0, 0)
  let max = Math.max(...excelHeader.map((item: any) => item.length))
  excelHeader
    .filter((e) => e.length < max)
    .forEach((e) => pushRowSpanPlaceHolder(e, max - e.length))
  return excelHeader
}

/**
 * @description:递归获取表头
 * @param {any[]} headers
 * @param {any[]} excelHeader excel头部
 * @param deep 递归深度
 * @param perOffset 前置偏移量
 * @returns {number} 后置偏移量
 */
const getHeader = (headers: any[], excelHeader: any[], deep: number, perOffset: number) => {
  let offset = 0
  let cur = excelHeader[deep]
  if (!cur) {
    cur = excelHeader[deep] = []
  }
  /* 填充合并占位符 */
  pushRowSpanPlaceHolder(cur, perOffset - cur.length)
  for (let i = 0; i < headers.length; i++) {
    let head = headers[i]
    cur.push(head.label)
    /* 如果有子节点，递归处理 */
    if (Array.isArray(head.children) && head.children.length > 0) {
      let childOffset = getHeader(head.children, excelHeader, deep + 1, cur.length - 1)
      pushColSpanPlaceHolder(cur, childOffset - 1)
      offset += childOffset
    } else {
      offset++
    }
  }
  return offset
}

/**
 * @description: 根据选中的数据展示列，生成结果
 * @param selcetedData 选中的数据
 * @param tableHeader 表头数据
 * @returns {any[]} 结果数据
 */
const extracData = (selcetedData: any[], tableHeader: any[]) => {
  let headerList = flatHeader(tableHeader)
  let excelRows: any[] = []
  if(selcetedData.length === 0) return excelRows

  /* 取其中data中一个数据获取key(所有数据的prop都是相同的) */
  let dataKeys = new Set(Object.keys(selcetedData[0]))

  selcetedData.some((e) => {
    if (e.children && e.children.length > 0) {
      let childKeys = Object.keys(e.children[0])
      for (let i = 0; i < childKeys.length; i++) {
        dataKeys.delete(childKeys[i])
      }
      return true
    }
  })

  flatData(selcetedData, (list: any[]) => {
    excelRows.push(buildExcelRow(dataKeys, headerList, list))
  })
  
  return excelRows
}

/** 
 * @description: 拍扁头部获取prop
 * @param {any[]} header 表头数据
 * @returns {string[]} prop数组
  */
const flatHeader = (header: any[]) => {
  let result: any[] = []
  header.forEach((item) => {
    if (item.hasOwnProperty('children')) {
      result.push(...flatHeader(item.children))
    } else if (item.hasOwnProperty('exeFun')) {
      result.push(item)
    } else if (item.hasOwnProperty('prop')) {
      result.push(item)
    }
  })
  return result
}

const flatData = (list: any[], eachDataCallback: Function) => {
  let resultList: any[] = []
  for (let i = 0; i < list.length; i++) {
    let data = list[i]
    let rawDataList: any[] = []
    if (data.children && data.children.length > 0) {
      for (let j = 0; j < data.children.length; j++) {
        let copy = Object.assign({}, data.children[j])
        rawDataList.push(copy)
        copy['rowSpan'] = j > 0 ? 0 : data.children.length
      }
    } else {
      data['rowSpan'] = 1
      rawDataList.push(data)
    }
    resultList.push(...rawDataList)
    if (typeof eachDataCallback === 'function') {
      eachDataCallback(rawDataList)
    }
  }
  return resultList
}

const buildExcelRow = (mainKeys: Set<string>, headers: any[], rawDataList: any[]) => {
  let sumCols: any[] = []
  let rows: any[] = []
  for (let i = 0; i < rawDataList.length; i++) {
    let cols = []
    let rawData = rawDataList[i]
    for (let j = 0; j < headers.length; j++) {
      let header = headers[j]
      if (rawData['rowSpan'] === 0 && mainKeys.has(header.prop)) {
        cols.push(`!$ROW_SPAN_PLACEHOLDER`)
      } else {
        let value
        if (typeof header.exeFun === 'function') {
          value = header.exeFun(rawData)
        } else {
          value = rawData[header.prop]
        }
        cols.push(value)
        if (header['summable'] && typeof value === 'number') {
          sumCols[j] = (sumCols[j] ? sumCols[j] : 0) + value
        }
      }
    }
    rows.push(...cols)
  }
  if (sumCols.length > 0) {
    rows.push(...sumRowHandle(sumCols))
  }
  return rows
}

const sumRowHandle = (sumCols: any[]) => {
  return []
}

const doMerges = (arr: any[]) => {
  let deep = arr.length
  let merges = []
  for (let y = 0; y < deep; y++) {
    let row = arr[y]
    let colSpan = 0
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '!$COL_SPAN_PLACEHOLDER') {
        row[x] = undefined
        if (x + 1 === row.length) {
          merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x } })
        }
        colSpan++
      } else if (colSpan > 0 && x > colSpan) {
        merges.push({ s: { r: y, c: x - colSpan - 1 }, e: { r: y, c: x - 1 } })
      } else {
        colSpan = 0
      }
    }
  }
  let colLength = arr[0].length
  for (let x = 0; x < colLength; x++) {
    let rowSpan = 0
    for (let y = 0; y < deep; y++) {
      if (arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
        arr[y][x] = undefined
        rowSpan++
        if (y + 1 === deep) {
          merges.push({ s: { r: y - rowSpan, c: x }, e: { r: y, c: x } })
        }
      } else if (rowSpan > 0 && y > rowSpan) {
        merges.push({ s: { r: y - rowSpan - 1, c: x }, e: { r: y - 1, c: x } })
        rowSpan = 0
      } else {
        rowSpan = 0
      }
    }
  }
  return merges
}

const aoa_to_sheet = (data: any[], headerRows: number) => {
  let ws: any = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      let cell: any = {
        v: data[R][C] || '',
        s: {
          font: {
            name: '宋体',
            sz: 11,
            color: { auto: 1 },
          },
          alignment: {
            wrapText: 1,
            horizontal: 'center',
            vertical: 'center',
            indent: 0,
          },
        },
      }

      if (R < headerRows) {
        cell.s.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' },
        }
        cell.s.fill = {
          patternY: 'solid',
          fgColor: { theme: 3, tint: 0.5, rgb: 'DDD9C4' },
          bgColor: { theme: 7, tint: 0.5, rgb: '8064A2' },
        }
      }
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R })
      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else {
        cell.t = 's'
      }
      ws[cell_ref] = cell
    }
  }
  // ws['C3'].s.alignment = {
  //   horizontal: "right",
  //   indent: 0,
  //   vertical: "top",
  //   underline :true,
  //   wrapText: 1
  // }
  // ws['C3'].v = "测试"
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range)
  }
  return ws
}

/**
 * @description: 填充合并占位符
 *  @param {any[]} arr 数组
 *  @param {number} count 占位符个数
 * */
const pushRowSpanPlaceHolder = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push('!$ROW_SPAN_PLACEHOLDER')
  }
}

/**
 * @description: 填充col合并占位符
 * @param {any[]} arr 数组
 * @param {number} count 占位符个数
 */
const pushColSpanPlaceHolder = (arr: any[], count: number) => {
  for (let i = 0; i < count; i++) {
    arr.push('!$COL_SPAN_PLACEHOLDER')
  }
}

/** 
 * @description： 设置表头宽度
 * @param {any[]} headers 表头数组
 * @returns {number[]} colWidths 列宽数组
  */
  const getHeaderWidth = (headers: number[]): number[] => {
    const cols:number[] = [];
    headers.forEach((header: any) => {
      if (header.children && header.children.length > 0) {
        cols.push(...getHeaderWidth(header.children));
      }else {
        cols.push(header.width ?? 100);
      }
    });
    return cols;
  }


/** 
 * @description: 获取表头列样式
 * @param: {any[]} headers 表头数组
 * @returns: {any[]} colStyles 列样式数组
  */
  const getHeaderStyle = (headers: any[]): any[] => {
    const colStyles: any[] = [];
    headers.forEach((header: any) => {
      if (header.children && header.children.length > 0) {
        colStyles.push(...getHeaderStyle(header.children));
      } else {
        colStyles.push({
          align: header.align ?? 'is-left',
          width: header.width ?? 100,
        } as any);
      }
    });
    return colStyles;
  }

/** 
 * @description: 设置样式align
 * @param {any[]} headerStyle 表头样式数组
 * @param {any} worksheet 工作表对象
**/
const setHeaderAlign = (headerStyle: any[], worksheet: any) => {
  if(!worksheet['!ref']) return worksheet;
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let col = 0; col < headerStyle.length; col++) {
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cell_ref = XLSX.utils.encode_cell({r: row, c: col});
      const cell = worksheet[cell_ref];
      if(!cell) continue;
      if(!cell.s) cell.s = {};
      cell.s.alignment = {
        ...cell.s.alignment,
        horizontal: headerStyle[col].align === 'is-center' ? 'center' : headerStyle[col].align === 'is-right' ? 'right' : 'left',
      }
      console.log(cell, cell.s.alignment)
    }
  }
  return worksheet;
}


</script>

<style lang="scss" scoped></style>
