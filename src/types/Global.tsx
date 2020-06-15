export interface KeyValue {
  key: string;
  value: string;
}

export interface PropertyDisplay {
  key: string;
  title: string;
  value?: string | Element | Element[] | null;
  formatter?: (value: any) => string | Element | Element[] | null;
  formatterWithComponents?: boolean;
}
