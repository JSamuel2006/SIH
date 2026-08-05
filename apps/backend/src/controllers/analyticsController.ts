import { Request, Response, NextFunction } from 'express';
import { scenarioRepository } from '../repositories/scenarioRepository.js';
import { geminiService } from '../services/ai-services/geminiService.js';

export async function getGeoHeatmap(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, disease } = req.query;
    return res.status(200).json({
      success: true,
      data: {
        district: district || 'All Districts',
        diseaseCategory: disease || 'All Diseases',
        anonymizedSamplePoints: [
          { geoHash: 'ttnf2', district: 'Pune', lat: 18.5204, lng: 73.8567, queryDensity: 84, trend: 'UP' },
          { geoHash: 'ttnf3', district: 'Pune', lat: 18.5314, lng: 73.8447, queryDensity: 62, trend: 'STABLE' },
          { geoHash: 'te71u', district: 'Mumbai', lat: 19.0760, lng: 72.8777, queryDensity: 95, trend: 'UP' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOutbreakAnomalies(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        totalAlerts: 3,
        alerts: [
          {
            id: 'alt-101',
            district: 'Pune',
            block: 'Haveli',
            diseaseTag: 'Dengue / High Fever',
            zScore: 3.42,
            baseline24h: 45,
            current24h: 189,
            increasePercentage: '320%',
            severity: 'HIGH',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alt-102',
            district: 'Nagpur',
            block: 'Nagpur Urban',
            diseaseTag: 'Acute Diarrheal Disease',
            zScore: 2.85,
            baseline24h: 30,
            current24h: 92,
            increasePercentage: '206%',
            severity: 'MEDIUM',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alt-103',
            district: 'Pune',
            block: 'Khed',
            diseaseTag: 'Influenza-Like Illness',
            zScore: 2.61,
            baseline24h: 22,
            current24h: 67,
            increasePercentage: '204%',
            severity: 'MEDIUM',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeGraph(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        nodes: [
          { id: 'dengue', label: 'Dengue Fever', type: 'DISEASE', description: 'Mosquito-borne viral infection caused by the dengue virus transmitted by Aedes aegypti mosquitoes.' },
          { id: 'malaria', label: 'Malaria', type: 'DISEASE', description: 'Parasitic disease transmitted by female Anopheles mosquitoes. Preventable and treatable.' },
          { id: 'fever', label: 'High Fever', type: 'SYMPTOM', description: 'Sudden high fever typically between 102°F–105°F, one of the primary dengue warning signs.' },
          { id: 'rash', label: 'Skin Rash', type: 'SYMPTOM', description: 'Characteristic flat red rash appearing over the limbs 3–4 days after fever onset.' },
          { id: 'chills', label: 'Chills & Rigors', type: 'SYMPTOM', description: 'Cyclical chills and shivering, classic malaria symptom occurring every 48–72 hours.' },
          { id: 'drainage', label: 'Drain Stagnant Water', type: 'PREVENTION', description: 'Eliminating vector breeding grounds inside flower pots, coolers, tyres, and containers.' },
          { id: 'repellent', label: 'Repellents (DEET)', type: 'PREVENTION', description: 'Applying DEET-based insect repellents on exposed skin and clothing.' },
          { id: 'nets', label: 'Mosquito Nets (LLIN)', type: 'PREVENTION', description: 'Long-lasting insecticidal nets distributed under National Vector Borne Disease Control Programme.' },
          { id: 'dengvaxia', label: 'Dengvaxia Vaccine', type: 'VACCINE', description: 'Dengue vaccine recommended for individuals with prior dengue infection in endemic areas.' },
          { id: 'pmjay', label: 'PM-JAY Scheme', type: 'SCHEME', description: 'Cashless treatment coverage up to ₹5 Lakh per year for eligible families at empanelled hospitals.' },
          { id: 'nvbdcp', label: 'NVBDCP Programme', type: 'SCHEME', description: 'National Vector Borne Disease Control Programme providing free testing kits and treatment at PHCs.' },
        ],
        links: [
          { source: 'dengue', target: 'fever' },
          { source: 'dengue', target: 'rash' },
          { source: 'dengue', target: 'drainage' },
          { source: 'dengue', target: 'repellent' },
          { source: 'dengue', target: 'dengvaxia' },
          { source: 'dengue', target: 'pmjay' },
          { source: 'malaria', target: 'fever' },
          { source: 'malaria', target: 'chills' },
          { source: 'malaria', target: 'nets' },
          { source: 'malaria', target: 'nvbdcp' },
          { source: 'dengue', target: 'nvbdcp' },
        ],
      },
        });
  } catch (error) {
    next(error);
  }
}

export async function getNews(req: Request, res: Response, next: NextFunction) {
  try {
    const rawAdvisories = [
      {
        id: 'adv-201',
        title: 'MoHFW issues monsoon advisory for vector-borne diseases',
        source: 'Ministry of Health & Family Welfare',
        category: 'Advisory',
        summary: 'MoHFW recommends immediate focus on local source reduction campaigns across western states to counter Dengue & Malaria vector density spikes during the monsoon season.',
        fullAdvisory: 'The advisory urges local civic bodies to conduct weekly dry-days to empty stagnant water collections. Hospitals are advised to reserve fever beds and maintain diagnostics kit inventory. District health officers should activate rapid response teams.',
        date: 'August 03, 2026',
      },
      {
        id: 'adv-202',
        title: 'ICMR updates guidelines for fever management protocols',
        source: 'Indian Council of Medical Research',
        category: 'Clinical Guidelines',
        summary: 'Updates include mandatory NS1 antigen testing within 48h of high fever onset and strict instructions against self-prescribing NSAIDs to prevent dengue hemorrhagic complications.',
        fullAdvisory: 'Clinicians should avoid prescribing aspirin, ibuprofen, or naproxen for fever control where vector diseases are suspected. Paracetamol is indicated as safe for first-line pain management. All positive NS1 cases must be notified to district surveillance officers within 24h.',
        date: 'July 28, 2026',
      },
      {
        id: 'adv-203',
        title: 'Mission Indradhanush vaccination campaign expands in Maharashtra',
        source: 'National Health Mission',
        category: 'Campaign',
        summary: 'The intensive immunization drive will target high-risk districts in Pune and Nagpur, focusing on zero-dose children under 5 years and pregnant women.',
        fullAdvisory: 'ASHA workers will conduct home visits to locate unimmunized children and register them on the CoWIN/U-WIN portal for scheduled immunization. Sessions will be held at anganwadi centres, schools, and community halls. Target: 95% primary immunization coverage by December 2026.',
        date: 'July 15, 2026',
      },
      {
        id: 'adv-204',
        title: 'WHO-SEARO issues alert on increased cholera risk in flood-affected zones',
        source: 'World Health Organization – SEARO',
        category: 'Advisory',
        summary: 'Post-flood conditions in low-lying areas increase cholera risk. WHO advises enhanced water quality surveillance and ORS pre-positioning at sub-centre level.',
        fullAdvisory: 'State governments should pre-position oral rehydration solution packets, chlorine tablets, and zinc supplements in flood-prone blocks. Public health messaging should emphasize hand hygiene, safe drinking water, and the 104 helpline for early reporting of diarrheal illness clusters.',
        date: 'August 01, 2026',
      },
    ];

    const systemInstruction = 'You are a professional medical science writer. Your task is to summarize the provided health advisory into a single, punchy, informative sentence under 30 words. Focus on practical clinical or preventive action. Start directly with the summary, no intro.';

    const advisoriesWithAiSummaries = await Promise.all(
      rawAdvisories.map(async (adv) => {
        try {
          const aiSummary = await geminiService.generateText(
            `Advisory Title: "${adv.title}"\nAdvisory Details: "${adv.fullAdvisory}"`,
            systemInstruction
          );
          return {
            ...adv,
            summary: aiSummary.trim(),
            aiGenerated: true,
          };
        } catch (err) {
          return {
            ...adv,
            aiGenerated: false,
          };
        }
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        advisories: advisoriesWithAiSummaries,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function simulateScenario(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      hospitalBeds = 80,
      medicalStaff = 75,
      orsStock = 80,
      testKits = 80,
      mosquitoNets = 50,
      vaccinationCoverage = 75,
      campaignReach = 65,
      campaignDuration = 4,
      budgetAllocation = 10,
      emergencyResponse = 70,
      healthLiteracy = 60,
      communityParticipation = 60,
      district = 'Pune',
      timePeriod = 'Next 30 Days',
    } = req.body;

    // Output computations based on structured assumptions
    const outbreakRiskIndicator = Math.max(
      5,
      Math.min(
        95,
        Math.round(95 - (vaccinationCoverage * 0.3) - (mosquitoNets * 0.25) - (campaignReach * 0.15) - (healthLiteracy * 0.1) - (communityParticipation * 0.1))
      )
    );

    const hospitalStressIndex = Math.max(
      0,
      Math.min(
        100,
        Math.round(outbreakRiskIndicator * 0.8 - (hospitalBeds * 0.35) - (medicalStaff * 0.25))
      )
    );

    const resourceUtilization = Math.max(
      10,
      Math.min(
        100,
        Math.round((outbreakRiskIndicator * 0.5 + (100 - orsStock) * 0.2 + (100 - testKits) * 0.2) * (1.2 - (budgetAllocation > 50 ? 0.2 : budgetAllocation * 0.004)))
      )
    );

    const awarenessCoverage = Math.max(
      5,
      Math.min(100, Math.round(campaignReach * 0.75 + communityParticipation * 0.25))
    );

    const vaccinationReach = Math.max(
      5,
      Math.min(
        100,
        Math.round(vaccinationCoverage * 0.8 + (budgetAllocation > 25 ? 12 : budgetAllocation * 0.48) + campaignReach * 0.08)
      )
    );

    const campaignEffectiveness = Math.max(
      5,
      Math.min(
        100,
        Math.round((campaignReach * 0.35 + campaignDuration * 4.5 + communityParticipation * 0.25) * (budgetAllocation > 15 ? 1.15 : 0.88))
      )
    );

    const operationalReadiness = Math.max(
      5,
      Math.min(
        100,
        Math.round(emergencyResponse * 0.4 + medicalStaff * 0.3 + testKits * 0.3)
      )
    );

    const citizenAwarenessScore = Math.max(
      5,
      Math.min(
        100,
        Math.round(healthLiteracy * 0.5 + campaignReach * 0.35 + communityParticipation * 0.15)
      )
    );

    const confidenceLevel = Math.max(
      88,
      Math.min(
        96,
        Math.round(85 + (campaignDuration > 6 ? 5 : 2) + (communityParticipation > 60 ? 4 : 1))
      )
    );

    // AI Recommendations engine
    const aiRecommendations: string[] = [];
    if (medicalStaff < 60) {
      aiRecommendations.push('Expand medical staffing by deploying temporary community health officers.');
    }
    if (orsStock < 50) {
      aiRecommendations.push('Pre-position additional ORS packets and rehydration inventory in high-risk zones.');
    }
    if (vaccinationCoverage < 75) {
      aiRecommendations.push('Launch door-to-door vaccine awareness campaigns under Mission Indradhanush.');
    }
    if (communityParticipation < 60) {
      aiRecommendations.push('Strengthen local leadership participation via Gram Panchayat and ASHA networks.');
    }
    if (mosquitoNets < 50) {
      aiRecommendations.push('Distribute free insecticide-treated nets (LLINs) in high vector-breeding zones.');
    }
    if (hospitalBeds < 65) {
      aiRecommendations.push('Set up temporary field isolation beds in local community kiosks.');
    }
    if (emergencyResponse < 65) {
      aiRecommendations.push('Conduct refresher training on outbreak response drills for field surveillance teams.');
    }
    if (outbreakRiskIndicator > 50) {
      aiRecommendations.push('Trigger active vector-control measures (larvicide spraying, water drainage audits).');
    }
    if (aiRecommendations.length === 0) {
      aiRecommendations.push('Maintain existing preventive structures and execute routine monthly audits.');
    }

    return res.status(200).json({
      success: true,
      data: {
        hospitalStressIndex,
        resourceUtilization,
        awarenessCoverage,
        vaccinationReach,
        campaignEffectiveness,
        operationalReadiness,
        citizenAwarenessScore,
        outbreakRiskIndicator,
        confidenceLevel,
        aiRecommendations,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSavedScenarios(req: Request, res: Response, next: NextFunction) {
  try {
    const list = await scenarioRepository.getAll();
    return res.status(200).json({ success: true, data: { scenarios: list } });
  } catch (error) {
    next(error);
  }
}

export async function saveScenario(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      officerId = 'usr-officer-01',
      officerName = 'Dr. Rajesh Sharma',
      district = 'Pune',
      timePeriod = 'Next 30 Days',
      hospitalBeds,
      medicalStaff,
      orsStock,
      testKits,
      mosquitoNets,
      vaccinationCoverage,
      campaignReach,
      campaignDuration,
      budgetAllocation,
      emergencyResponse,
      healthLiteracy,
      communityParticipation,
      hospitalStressIndex,
      resourceUtilization,
      awarenessCoverage,
      vaccinationReach,
      campaignEffectiveness,
      operationalReadiness,
      citizenAwarenessScore,
      outbreakRiskIndicator,
      confidenceLevel,
      aiRecommendations,
    } = req.body;

    const saved = await scenarioRepository.create({
      officerId,
      officerName,
      district,
      timePeriod,
      hospitalBeds,
      medicalStaff,
      orsStock,
      testKits,
      mosquitoNets,
      vaccinationCoverage,
      campaignReach,
      campaignDuration,
      budgetAllocation,
      emergencyResponse,
      healthLiteracy,
      communityParticipation,
      hospitalStressIndex,
      resourceUtilization,
      awarenessCoverage,
      vaccinationReach,
      campaignEffectiveness,
      operationalReadiness,
      citizenAwarenessScore,
      outbreakRiskIndicator,
      confidenceLevel,
      aiRecommendations,
    });

    return res.status(201).json({ success: true, data: { scenario: saved } });
  } catch (error) {
    next(error);
  }
}

export async function deleteScenario(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const deleted = await scenarioRepository.delete(id);
    return res.status(200).json({ success: true, data: { deleted } });
  } catch (error) {
    next(error);
  }
}

export async function simulateDigitalTwin(req: Request, res: Response, next: NextFunction) {
  try {
    const { campaignCoverage = 65, hospitalBeds = 82, awarenessLevel = 70 } = req.body;
    const simulatedOutbreakProbability = Math.max(
      5,
      Math.min(95, Math.round(120 - campaignCoverage * 0.8 - awarenessLevel * 0.5))
    );
    const hospitalStress = Math.max(0, Math.min(100, Math.round(100 - hospitalBeds * 0.7 + simulatedOutbreakProbability * 0.3)));
    return res.status(200).json({
      success: true,
      data: {
        simulatedOutbreakProbability,
        hospitalStressIndex: hospitalStress,
        riskLevel: simulatedOutbreakProbability > 60 ? 'HIGH RISK' : simulatedOutbreakProbability > 30 ? 'MODERATE RISK' : 'LOW RISK',
        recommendation: simulatedOutbreakProbability > 60
          ? 'Initiate emergency bed reallocation and accelerate community campaign deployment.'
          : simulatedOutbreakProbability > 30
          ? 'Maintain current alert posture. Scale mosquito net distribution and activate ASHA surveillance nodes.'
          : 'System stable. Continue routine monitoring and campaign activities.',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getResourceInventory(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        resources: [
          { name: 'Dengue Test Kits (Pune)', current: 12400, total: 15000, unit: 'kits', status: 'OK' },
          { name: 'ASHA Mosquito Nets (Haveli)', current: 1200, total: 8000, unit: 'nets', status: 'CRITICAL' },
          { name: 'ORS Packet Stock (ASHA Network)', current: 45000, total: 50000, unit: 'packets', status: 'OK' },
          { name: 'Malaria RDT Kits (Nagpur)', current: 3800, total: 6000, unit: 'kits', status: 'WARNING' },
          { name: 'Chlorine Tablets (Flood Zone)', current: 9200, total: 12000, unit: 'tablets', status: 'OK' },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function acknowledgeAlert(req: Request, res: Response, next: NextFunction) {
  try {
    const { alertId } = req.body;
    return res.status(200).json({
      success: true,
      message: `Alert ${alertId} has been successfully acknowledged and assigned to the District Surveillance Officer.`,
    });
  } catch (error) {
    next(error);
  }
}
