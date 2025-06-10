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
  checkedOptions: {
    type: Array as PropType<ColumnType[]>,
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

export type TableProps = {
	// 数据列表
	data?: Record<string, any>[]
	// columns列表
	columns: ColumnType[]
	// 选中column的配置参数
	checkedOptions?: ColumnType[]
	// 自定义列配置相关
	columnsConfig?: {
		defaultCheckedOptions?: ColumnType[]
		columns?: ColumnType[]
	}
	// 搜索条件
	searchParams?: SearchParams
	// 数组总数
	total?: number
	// 表格的控制参数
	options?: TableOptions
	curRow?: { [key: string]: any } | null
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
  prop: string
  label: string
  width?: number
  children?: ColumnType[]
}

export interface flattenColumnsType {
  prop: string
  label: string
  width: number
}

export interface SearcjParams {
  page: number
  size: number
}

export type TableOptions = InstanceType<typeof ElTable>['$props'] & Options


export type SearchParams = {
	page: number
	size: number
	[key: string]: any
}