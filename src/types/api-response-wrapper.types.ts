export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

export type BulkJobResponse = {
  jobId: string;
  message: string;
};
