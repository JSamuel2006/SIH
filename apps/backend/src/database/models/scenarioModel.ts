export interface ScenarioEntity {
  id: string;
  officerId: string;
  officerName: string;
  district: string;
  timePeriod: string;
  createdAt: Date;

  // 14 Inputs
  hospitalBeds: number; // 0-100%
  medicalStaff: number; // 0-100%
  orsStock: number; // 0-100%
  testKits: number; // 0-100%
  mosquitoNets: number; // 0-100%
  vaccinationCoverage: number; // 0-100%
  campaignReach: number; // 0-100%
  campaignDuration: number; // 1-12 weeks
  budgetAllocation: number; // in Lakhs
  emergencyResponse: number; // 0-100%
  healthLiteracy: number; // 0-100%
  communityParticipation: number; // 0-100%

  // Outputs
  hospitalStressIndex: number;
  resourceUtilization: number;
  awarenessCoverage: number;
  vaccinationReach: number;
  campaignEffectiveness: number;
  operationalReadiness: number;
  citizenAwarenessScore: number;
  outbreakRiskIndicator: number;

  confidenceLevel: number;
  aiRecommendations: string[];
}
