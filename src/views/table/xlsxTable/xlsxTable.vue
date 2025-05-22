<!-- 
  @description: xlsx 下载问题
-->

<template>
  <el-table ref="tableRef" :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection"  width="55" />
    <el-table-column fixed="left" label="id" width="100" prop="id">
      <!-- <template #default="scope">
        <div v-show="false">xx</div>
        序号:{{ scope.$index }}</br>
        id:{{ scope.row.id }}
      </template> -->
    </el-table-column>
    <el-table-column label="日期" prop="date" width="150">

    </el-table-column>
    <el-table-column label="配送信息">
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="province" label="省份" width="120"></el-table-column>
      <el-table-column prop="city" label="城市" width="120"></el-table-column>
      <el-table-column prop="area" label="区县" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" width="200"></el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
    </el-table-column>

    <el-table-column  label="标签" width="100">
      <template #default="scope">
        <el-tag type="success">标签</el-tag>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="200">
      <template #default="scope">
        <el-button  size="small">查看</el-button>
        <el-button  size="small">编辑</el-button>
      </template>
    </el-table-column>

  </el-table>
  <el-button @click="downloadExcel(tableData,'table', 'table')" >download</el-button>
 
</template>

<script setup lang='ts'>



import { h, ref } from 'vue'
import * as XLSX from 'xlsx'

const tableRef = ref();
const tableData: any = ref([
  { 
    id:1,
    date: '2022-01-01',
    name: '张三',
    province: '上海',
    city: '上海市',
    area: '浦东新区',
    address: '上海市浦东新区东方路100号',
    zip: '200000'
  },{
    id:2,
    date: '2022-01-02',
    name: '李四',
    province: '北京',
    city: '北京市',
    area: '朝阳区',
    address: '北京市朝阳区北三环东路100号',
    zip: '100000'
  },{
    id:3,
    date: '2022-01-03',
    name: '王五',
    province: '广东',
    city: '广州市',
    area: '天河区',
    address: '广州市天河区黄埔大道100号',
    zip: '510000'
  },{
    id:4,
    date: '2022-01-04',
    name: '赵六',
    province: '江苏',
    city: '南京市',
    area: '雨花台区',
    address: '南京市雨花台区雨花路100号',
    zip: '210000'
  },{
    id:5,
    date: '2022-01-05',
    name: '柳七',
    city: '苏州市',
    area: '姑苏区',
    address: '苏州市姑苏区苏州街100号',
    zip: '215000'
  }
]);
const selectionData = ref([]);
selectionData.value = tableData.value;

const handleSelectionChange = (selection: any) => {
  selectionData.value = selection;
}



/** 
 * @description: 根据table实例表头，转为结构化数据
 * @returns {any[]} 结构化数据
  */
const getTableData = (excludeLabel:string[] = []): any[] => {
  /* 1.将实例的一级表头转为结构化数据 */
  const headers = tableRef.value.columns
    .filter((col: any) => col.type !== 'selection' && !excludeLabel.includes(col.label)) // Skip selection columns
    .map((col: any) => {
      return {
        label: col.label,
        children: col.children || [],
        prop: col.property,
      }
    });


  /* 2.将递归转为结构化数据 */
  const toData = (headers:any[]) => {
    let result: any[] = [];
    headers.forEach((header: any) => {
      if(header.hasOwnProperty('children') && Array.isArray(header.children) && header.children.length > 0) {
        result.push({
          label: header.label,
          children: toData(header.children),
        })
      } else {
        result.push({
          label: header.label,
          prop: header.prop || header.property,
        })
      }
    })
    return result;
  }
  const tableHeader = toData(headers);
  console.log(tableHeader)
  return tableHeader;
}


  const downloadExcel = (data: any[], sheetName: string, fileName: string) => {
    /* 获取表头数据 */
   const tableHeader = getTableData(['标签','操作']);
    const excelHeader = buildHeader(tableHeader);
    const headerRows = excelHeader.length;
    let dataList = extracData(selectionData.value, tableHeader)
    excelHeader.push(...dataList,[]);
    let merges = doMerges(excelHeader);
    let ws = aoa_to_sheet(excelHeader,headerRows)
    console.log(ws)
    ws['!merges'] = merges;
    ws['!freeze'] = {
      xSplit: '1',
      ySplit: '' + headerRows,
      topLeftCell: 'B' + (headerRows + 1),
      activePane: 'bottomRight',
      state: 'frozen'
    };
    ws['!cols'] = [{wpx:165}]
    let workbook: XLSX.WorkBook = {
      SheetNames: [sheetName],
      Sheets: {}
    }
    workbook.Sheets[sheetName] = ws;
    // let wopts = {
    //   bookType: 'xlsx',
    //   bookSST: false,
    //   type: 'binary',
    //   cellStyles: true,
    // }
    // let wbout = XLSX.write(workbook,wopts);
    // let blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // openDownloadXLSXDialog(blob, fileName + '.xlsx')
    // return XLSX.writeFile(workbook, fileName + '.xlsx', {bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true});
  }

/** 
 * @description:构建表头
 * @param {any[]} data 表头数据
 * @return {any[]} excel表格展示的表头
  */
  const buildHeader = (data: any[]) => {
    
    let excelHeader:any[] = [];
    getHeader(data, excelHeader, 0,0);
    let max = Math.max(...(excelHeader.map((item:any) => item.length)));
    excelHeader.filter(e => e.length < max).forEach(e => pushRowSpanPlaceHolder(e, max - e.length))
    // console.log(excelHeader)
    return excelHeader;

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
  let offset = 0;
  let cur = excelHeader[deep];
  if(!cur) {
    cur = excelHeader[deep] = [];
  }
  /* 填充合并占位符 */
  pushRowSpanPlaceHolder(cur, perOffset - cur.length);
  for(let i = 0; i < headers.length; i++) {
    let head = headers[i];
    cur.push(head.label);
    /* 如果有子节点，递归处理 */
    if(Array.isArray(head.children) && head.children.length > 0){
      let childOffset = getHeader(head.children, excelHeader, deep + 1,cur.length - 1);
      pushColSpanPlaceHolder(cur, childOffset - 1);
      offset += childOffset
    } else {
      offset++;
    }
  }
  return offset;
}

/** 
 * @description: 根据选中的数据展示列，生成结果
 * @param selcetedData 选中的数据
 * @param tableHeader 表头数据
 * @returns {any[]} 结果数据
  */
const extracData = (selcetedData: any[], tableHeader: any[]) => {
  let headerList = flatHeader(tableHeader);
  let excelRows: any[] = [];
  let dataKeys = new Set(Object.keys(selcetedData[0]))
  selcetedData.some(e => {
    if(e.children && e.children.length > 0) {
      let childKeys = Object.keys(e.children[0]);
      for(let i = 0; i < childKeys.length; i++) {
        dataKeys.delete(childKeys[i]);
      }
      return true;
    }
  })
  flatData(selcetedData, (list:any[]) => {
    excelRows.push(buildExcelRow(dataKeys, headerList, list))
  })
  return excelRows;
}

const flatHeader = (header: any[]) => {
  let result: any[] = [];
  header.forEach(item => {
    if(item.hasOwnProperty('children')) {
      result.push(...flatHeader(item.children));
    } else if( item.hasOwnProperty('exeFun')) {
      result.push(item);
    } else if (item.hasOwnProperty('prop')) {
      result.push(item);
    }
  })
  return result;
}

const flatData = (list:any[], eachDataCallback:Function) => {
  let resultList: any[] = [];
  for(let i = 0; i < list.length; i++) {
    let data = list[i];
    let rawDataList: any[] = [];
    if(data.children && data.children.length > 0) {
      for (let j = 0; j < data.children.length; j++) {
        let copy = Object.assign({}, data.children[j]);
        rawDataList.push(copy);
        copy['rowSpan'] = (j > 0 ? 0 : data.children.length)
      }
    } else {
      data['rowSpan'] = 1;
      rawDataList.push(data);
    }
    resultList.push(...rawDataList);
    if(typeof eachDataCallback === 'function') {
      eachDataCallback(rawDataList);
    }
  }
  return resultList;
}

const buildExcelRow = (mainKeys: Set<string>, headers: any[], rawDataList: any[]) => {
  let sumCols: any[] = [];
  let rows: any[] = [];
  for(let i = 0; i < rawDataList.length; i++) {
    let cols = [];
    let rawData = rawDataList[i];
    for(let j = 0; j < headers.length; j++) {
      let header = headers[j];
      if(rawData['rowSpan'] === 0 && mainKeys.has(header.prop)) {
        cols.push(`!$ROW_SPAN_PLACEHOLDER`)
      } else {
        let value;
        if(typeof header.exeFun === 'function') {
          value = header.exeFun(rawData);
        } else {
          value = rawData[header.prop];
        }
        cols.push(value);
        if(header['summable'] && typeof value === 'number') {
          sumCols[j] = (sumCols[j] ?  sumCols[j] : 0) + value;
        }
      }
    }
    rows.push(cols);
  }
  if(sumCols.length > 0) {
    rows.push(sumRowHandle(sumCols))
  }
  return rows;
}

const sumRowHandle = (sumCols: any[]) => {
  return [];
}


const doMerges = (arr: any[]) => {
  let deep = arr.length;
  let merges = [];
  for(let y = 0; y < deep; y++) {
    let row = arr[y];
    let colSpan = 0;
    for(let x = 0; x < row.length; x++) {
      if(row[x] === '!$COL_SPAN_PLACEHOLDER') {
        row[x] = undefined;
        if(x + 1 === row.length) {
          merges.push({s: {r: y, c: x - colSpan - 1}, e: {r: y, c: x}})
        }
        colSpan++;
      } else if (colSpan > 0 && x > colSpan) {
        merges.push({s: {r: y, c: x - colSpan - 1}, e: {r: y, c: x - 1}})
      } else {
        colSpan = 0;
      }
    }
  }
  let colLength = arr[0].length;
  for(let x = 0; x < colLength; x++) {
    let rowSpan = 0;
    for(let y = 0; y < deep; y++) {
      if(arr[y][x] === '!$ROW_SPAN_PLACEHOLDER') {
        arr[y][x] = undefined;
        rowSpan++;
        if(y + 1 === deep) {
          merges.push({s: {r: y - rowSpan, c: x}, e: {r: y, c: x}})
        }
      } else if (rowSpan > 0 && y > rowSpan) {
        merges.push({s: {r: y - rowSpan - 1, c: x}, e: {r: y - 1, c: x}})
        rowSpan = 0;
      } else {
        rowSpan = 0;
      }
    }
  }
  return merges;
}


const aoa_to_sheet = (data: any[], headerRows: number) => {
  let ws: any = {};
  const range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  for(let R = 0; R !== data.length; ++R) {
    for(let C = 0; C !== data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      let cell:any = {
        v: data[R][C] || '',
        s: {
          font: {
            name: '宋体', sz: 11, color: { auto: 1 }
          },
          alignment: {
            wrapText:1,
            horizontal: 'center',
            vertical: 'center',
            indent: 0
          }
        }
      };

      if( R < headerRows) {
        cell.s.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
        cell.s.fill = {
          patternY: 'solid',
          fgColor: { theme: 3 , 'tint': 0.5, rgb:'DDD9C4' },
          bgColor: { theme:7, 'tint': 0.5, rgb:'8064A2' }
        }
      }
      const cell_ref = XLSX.utils.encode_cell({c: C, r: R});
      if(typeof cell.v === 'number') {
        cell.t = 'n';
      } else if(typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else {
        cell.t ='s';
      }
      ws[cell_ref] = cell;
    }
  }
  if(range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range);
  }
  return ws;
}


/**
 * @description: 填充合并占位符
 *  @param {any[]} arr 数组
 *  @param {number} count 占位符个数
 * */
const pushRowSpanPlaceHolder = (arr: any[], count: number) => {
  for(let i = 0; i < count; i++) {
    arr.push('!$ROW_SPAN_PLACEHOLDER')
  }
}

/** 
 * @description: 填充col合并占位符
 * @param {any[]} arr 数组
 * @param {number} count 占位符个数
  */
  const pushColSpanPlaceHolder = (arr: any[], count: number) => {
    for(let i = 0; i < count; i++) {
      arr.push('!$COL_SPAN_PLACEHOLDER')
    }
  }

const s2ab = (s: string) => {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

// const openDownloadXLSXDialog = (url: any, saveName: string) => {
//   if(typeof url === 'object' && url instanceof Blob) {
//     url = window.URL.createObjectURL(url);
//   }
//   let aLink = document.createElement('a');
//   aLink.href = url;
//   aLink.download = saveName || "";
//   let event;
//   if(window.MouseEvent) {
//     event = new MouseEvent('click');
//   } else {
//     event = document.createEvent('MouseEvents');
//     event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, 0, null);
//   }
//   aLink.dispatchEvent(event);
// }

  




</script>

<style lang='scss' scoped>
</style>