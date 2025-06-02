import type { PropType } from 'vue'
import type { ElTable } from 'element-plus'

export const tableProps = {
  columns: {
    type: Array as () => ColumnType[],
    required: true,
    default: () => [],
  },
  columnsConfig: {
    type: Object as PropType<columnsConfig>,
  },
  data: {
    type: Array as () => any[],
    required: true,
    default: () => [],
  },
  searchParams: {
    type: Object as () => SearcjParams,
    default: () => ({
      page: 1,
      size: 20,
    }),
  },
  total: {
    type: Number,
    default: 0,
  },
  curRow: {
    type: Object as PropType<{ [key: string]: any } | null>,
    default: null,
  },
  options: {
    type: Object as PropType<TableOptions>,
    default: () => {
      return {}
    },
  },
}

export type Options = {
  /* el-table 参数 */
  height?: string
  maxHeight?: string
  size?: string

  /* 分页器参数 */
  pageSizes?: number[]
  layout?: string
  background?: boolean

  loading?: boolean

  multipleSelect?: boolean
  currentRowKey?: string
  align?: string
  resiezable?: boolean
  indexLabel?: string
  showPagination?: boolean
  [key: string]: any
}

export interface columnsConfig {
  checkedOptions?: TableOptions
  columns: ColumnType[]
}

export interface ColumnType {
  prop?: string
  label: string
  width?: number
  children?: ColumnType[]
}

export interface SearcjParams {
  page: number
  size: number
}

export type TableOptions = InstanceType<typeof ElTable>['$props'] & Options

export const defaultTableOptions: TableOptions = {
  height: '100%',
  maxHeight: '100%',
  size: 'default',
  pageSizes: [10, 20, 30, 40, 50],
  layout: 'total, size, prev, pager, next, jumper',
  background: true,
  loading: false,
  multipleSelect: false,
  rowKey: 'id',
  resiezable: false,
  indexLabel: 'No.',
  showPagination: true,
}
