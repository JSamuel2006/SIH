import { ScenarioEntity } from '../database/models/scenarioModel.js';

export class ScenarioRepository {
  private scenarios: ScenarioEntity[] = [
    {
      id: 'scn-101',
      officerId: 'usr-officer-01',
      officerName: 'Dr. Rajesh Sharma',
      district: 'Pune',
      timePeriod: 'Next 30 Days',
      createdAt: new Date(),
      hospitalBeds: 80,
      medicalStaff: 75,
      orsStock: 90,
      testKits: 85,
      mosquitoNets: 40,
      vaccinationCoverage: 70,
      campaignReach: 60,
      campaignDuration: 4,
      budgetAllocation: 15,
      emergencyResponse: 75,
      healthLiteracy: 65,
      communityParticipation: 55,
      hospitalStressIndex: 45,
      resourceUtilization: 68,
      awarenessCoverage: 62,
      vaccinationReach: 74,
      campaignEffectiveness: 58,
      operationalReadiness: 72,
      citizenAwarenessScore: 66,
      outbreakRiskIndicator: 35,
      confidenceLevel: 92,
      aiRecommendations: [
        'Increase mosquito net distribution by 20% in high-risk zones.',
        'Expand community participation drives through local Anganwadi centers.',
      ],
    },
  ];

  public async getAll(): Promise<ScenarioEntity[]> {
    return this.scenarios;
  }

  public async getByOfficer(officerId: string): Promise<ScenarioEntity[]> {
    return this.scenarios.filter((s) => s.officerId === officerId);
  }

  public async create(data: Omit<ScenarioEntity, 'id' | 'createdAt'>): Promise<ScenarioEntity> {
    const newScenario: ScenarioEntity = {
      id: `scn-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    this.scenarios.push(newScenario);
    return newScenario;
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.scenarios.length;
    this.scenarios = this.scenarios.filter((s) => s.id !== id);
    return this.scenarios.length < initialLength;
  }
}

export const scenarioRepository = new ScenarioRepository();
