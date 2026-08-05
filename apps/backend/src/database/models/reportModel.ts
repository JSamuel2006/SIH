export interface ReportEntity {
  id: string;
  district: string;
  month: string;
  format: 'PDF' | 'EXCEL';
  downloadUrl: string;
  status: 'COMPLETED' | 'PENDING';
  createdAt: Date;
}
