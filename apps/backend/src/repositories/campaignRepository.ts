import { CampaignEntity } from '../database/models/campaignModel.js';

export class CampaignRepository {
  private campaigns: CampaignEntity[] = [
    {
      id: 'cmp-101',
      district: 'Pune',
      block: 'Haveli',
      diseaseTag: 'Dengue Prevention',
      channel: 'SMS',
      recipientCount: 45000,
      status: 'DISPATCHED',
      createdAt: new Date(),
    },
  ];

  public async getAll(): Promise<CampaignEntity[]> {
    return this.campaigns;
  }

  public async create(data: Omit<CampaignEntity, 'id' | 'createdAt'>): Promise<CampaignEntity> {
    const newCampaign: CampaignEntity = {
      id: `cmp-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }
}

export const campaignRepository = new CampaignRepository();
