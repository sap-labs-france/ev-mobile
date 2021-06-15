export interface SortingParam {
  field: string;
}

export interface PagingParams {
  limit: number;
  skip: number;
  onlyRecordCount?: boolean;
  sort?: any;
}

export default interface QueryParams {
  [param: string]: string | string[] | number | boolean;
}
