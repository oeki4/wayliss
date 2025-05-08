export interface ServerResponse<T> {
  success: boolean;
  code: number;
  data: T;
  message?: string;
}
