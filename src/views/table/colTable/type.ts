export interface ColumnType {
  prop?: string;
  label: string;
  width?: number;
  children?: ColumnType[];
}