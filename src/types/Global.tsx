export interface KeyValue {
  key: string;
  value: string;
}

export interface PropertyDisplay {
  key: string;
  title: string;
  value?: string;
  formatter?: (value: any) => string|Element|Element[]|null;
  formatterWithComponents?: boolean;
}
