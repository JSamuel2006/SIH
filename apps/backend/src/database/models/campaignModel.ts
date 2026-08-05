export interface CampaignEntity {
  id: string;
  district: string;
  block?: string;
  diseaseTag: string;
  channel: 'SMS' | 'WHATSAPP' | 'IVR';
  recipientCount: number;
  status: 'DISPATCHED' | 'SCHEDULED' | 'FAILED';
  createdAt: Date;
}
