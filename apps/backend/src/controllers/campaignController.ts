import { Request, Response, NextFunction } from 'express';
import { campaignRepository } from '../repositories/campaignRepository.js';
import { geminiService } from '../services/ai-services/geminiService.js';


// Content library — grounded in NVBDCP, ICMR, WHO, and NHM protocols
const CONTENT_LIBRARY: Record<string, Record<string, Record<string, string>>> = {
  'Dengue Prevention': {
    'SMS': {
      'General Public': `🔴 HEALTH ALERT | ${new Date().toLocaleDateString('en-IN')}
Dengue cases are rising in your district. Protect yourself NOW:
1. Empty stagnant water from coolers, pots & tyres weekly.
2. Wear full-sleeved clothes.
3. Use DEET-based repellents.
4. Fever for 48+ hrs? Get a FREE NS1 test at your nearest PHC.
📞 Health Helpline: 104 | Emergency: 108
– District Health Officer`,
      'School Children': `🏫 SCHOOL HEALTH ALERT
Dear Parents & Students — Dengue season is here!
✅ Empty water containers at home every Sunday (Dengue mosquitoes breed in clean water).
✅ Wear full-sleeved uniform.
✅ Report any fever over 48hrs to school health officer.
Free testing at all government PHCs. Stay safe!
📞 104 for health queries.`,
      'Maternal & Pregnant Women': `👶 MATERNAL HEALTH ADVISORY
Dengue during pregnancy is high-risk. Protect yourself:
✅ Sleep under mosquito nets — free from ASHA workers.
✅ Avoid crowded areas during peak mosquito hours (dawn/dusk).
✅ Fever for 24+ hrs? Contact your ASHA worker or call 104 immediately.
Free antenatal care available at all PHCs. Your health is our priority.`,
    },
    'WHATSAPP': {
      'General Public': `*🏥 Dengue Prevention Advisory*
*National Vector Borne Disease Control Programme (NVBDCP)*

Protect your family this monsoon from *Dengue Fever*:

*🔴 Source Reduction (Most Effective):*
• Inspect home for stagnant water every Sunday
• Empty flower pots, coolers, tyres, and containers
• Add mosquito repellent oil to water storage tanks

*🟡 Personal Protection:*
• Wear full-sleeved clothing
• Apply DEET-based repellent (available at PHCs free)
• Use long-lasting insecticidal nets (LLIN) at night

*🟢 Early Detection:*
• Fever for 48+ hrs → Get FREE NS1 antigen test
• Avoid self-medicating with aspirin or ibuprofen

📞 *Dial 104* for free health consultations
🏥 Nearest PHC: Find at *nhp.gov.in/find-a-hospital*

*This advisory is issued under NVBDCP, MoHFW*`,
      'School Children': `*🎒 School Dengue Awareness Campaign*

Dear Student & Parent 👋

Dengue mosquitoes (*Aedes aegypti*) breed in *clean, standing water* — not dirty water!

*Action Plan for Your Home:*
🪣 Check coolers, flower pots, tyres every Sunday
🌿 Plant tulsi/neem near windows (natural repellent)
👕 Wear full-sleeved uniform to school

*If You Have Fever:*
❌ Do NOT take aspirin
✅ Take paracetamol only
📞 Tell parents to call 104 immediately

*Free dengue test kits at all government PHCs.*

Stay healthy, stay in school! 🏫`,
      'Maternal & Pregnant Women': `*👶 Maternal Health: Dengue Protection*

Dear expectant mother 🌸

Dengue during pregnancy can cause complications. Your protection matters:

*Do This Daily:*
✅ Sleep under mosquito nets (free from ASHA worker)
✅ Use repellent on exposed skin — safe for pregnancy
✅ Drain any standing water around your home

*Warning Signs — Call 104 Immediately:*
🔴 Fever above 38°C for more than 24 hours
🔴 Severe headache or pain behind eyes
🔴 Any bleeding or rash

*Your ASHA worker is available for home visits.*
Your health and your baby's health are our priority. 💙`,
    },
    'SPEECH': {
      'General Public': `Respected citizens,

Today, we face an urgent but preventable threat — Dengue fever. As your District Health Officer, I want to share three actions that can protect your entire family:

First: Every Sunday, inspect your home for stagnant water. Empty flower pots, coolers, and any containers. Aedes mosquitoes — the carriers of dengue — breed only in clean, standing water. Eliminating their breeding grounds is our most powerful weapon.

Second: Personal protection matters. Wear full-sleeved clothing during dawn and dusk, when mosquitoes are most active. DEET-based repellents are available free at your nearest Primary Health Centre.

Third: Early detection saves lives. If you or a family member has fever for more than 48 hours, do not self-medicate. Visit your PHC for a free NS1 antigen test. Dengue is treatable when caught early.

Together, we can make our district dengue-free. Thank you.`,
      'School Children': `Good morning, respected Principal, teachers, and my dear friends!

Today I want to talk about a small but dangerous enemy — the Aedes mosquito — and how we can defeat it with just one hour every Sunday.

Did you know? Dengue mosquitoes do not breed in rivers or ponds. They breed in clean water — in the cooler at your home, in a flower pot, in an old tyre. Just one teaspoon of standing water is enough.

Your mission, should you choose to accept it: Every Sunday morning, ask your parents to empty all water containers at home. This single act can prevent dengue in your entire neighbourhood.

Remember our three rules:
One — Empty water. Two — Wear full sleeves. Three — Fever? Call 104.

Let us make our school and our homes dengue-free! Thank you!`,
      'Maternal & Pregnant Women': `Dear sisters and expectant mothers,

Your health during pregnancy is not just about you — it is about the new life you are bringing into this world. That is why I want to speak to you today about dengue protection.

Dengue during pregnancy can cause serious complications. But the good news is — prevention is simple and free.

Your ASHA worker will provide you with a mosquito net at no cost. Please use it every night. Apply mosquito repellent on your arms and legs, especially at dawn and dusk.

If you develop fever, do not wait. Call your ASHA worker or dial 104 immediately. Dengue is dangerous in pregnancy, but it is manageable when we act early.

Your health is our responsibility. We are here for you, always. Thank you.`,
    },
  },
  'Malaria Prevention': {
    'SMS': {
      'General Public': `🔴 MALARIA ALERT | NVBDCP Advisory
Malaria risk is high in your area this season.
✅ Sleep under LLIN mosquito nets (free from ASHA)
✅ Take prescribed antimalarial prophylaxis if advised
✅ Fever + chills every 48-72 hrs? → FREE malaria RDT test at PHC
📞 Health Helpline: 104
– District Health Officer`,
      'School Children': `🏫 MALARIA AWARENESS
Dear Students — Cyclical fever with chills? Could be malaria!
✅ Sleep under insecticidal nets
✅ Don't leave water stagnant near your home
✅ Report any fever to parents immediately
Free RDT testing at all government PHCs. Stay safe!`,
      'Maternal & Pregnant Women': `👶 MATERNAL ADVISORY: Malaria
Malaria in pregnancy is dangerous for both mother and baby.
✅ Use LLIN nets nightly (free from ASHA)
✅ Any fever — contact ASHA worker immediately
✅ Safe antimalarial treatment available at PHCs
📞 Call 104 for urgent health advice.`,
    },
    'WHATSAPP': {
      'General Public': `*🦟 Malaria Prevention Advisory*
*NVBDCP — Ministry of Health & Family Welfare*

Signs of malaria: cyclical fever, chills, sweating every 48-72 hours.

*Prevention:*
• Sleep under Long-Lasting Insecticidal Nets (LLIN) — free from ASHA
• Spray indoor residual insecticide (IRS) — request from PHC
• Eliminate stagnant water (Anopheles mosquitoes breed in slow-moving water)

*Diagnosis & Treatment: 100% Free at PHCs*
• Rapid Diagnostic Test (RDT) results in 15 minutes
• Complete treatment course provided at zero cost

📞 *104* for health consultations`,
      'School Children': `*🏫 Malaria Awareness for Schools*

Malaria causes cyclical fever with chills — like clockwork every 2-3 days.

*Your 3-step action plan:*
1️⃣ Sleep under mosquito nets every night
2️⃣ Tell your family to remove all stagnant water near your home
3️⃣ Any fever + chills → go to the PHC for a free test

*Free RDT testing at all government health centres.*`,
      'Maternal & Pregnant Women': `*🤰 Malaria in Pregnancy — Critical Alert*

Dear expectant mother,

Malaria during pregnancy increases the risk of low birth weight and anaemia. Please protect yourself:

✅ Use LLIN nets every night (free from your ASHA worker)
✅ Any fever or chills — seek care within 24 hours
✅ Safe malaria treatment is available at your PHC

*Your ASHA worker can test you for malaria at home.*
📞 Call 104 for immediate health guidance.`,
    },
    'SPEECH': {
      'General Public': `Respected citizens, today we address one of our oldest health challenges — malaria. While it has existed for centuries, we now have the tools to defeat it in our lifetime.

The key actions are simple: Use the mosquito nets provided free by your ASHA worker every single night. Remove stagnant water from around your homes — Anopheles mosquitoes, unlike Aedes, breed in slow-moving, partially shaded water near fields and drains.

If you experience fever with chills that come and go in cycles — please do not ignore it. Visit your nearest PHC for a free Rapid Diagnostic Test. Your result comes in 15 minutes, and treatment is provided at zero cost. Together, we can eliminate malaria from our district. Thank you.`,
      'School Children': `Good morning everyone! Do you know the difference between dengue and malaria? Dengue gives you a constant fever, but malaria gives you fever that comes and goes — like a clock — every two or three days, with chills and sweating.

Here is what you can do: Ask your family to sleep under mosquito nets every night. Your ASHA worker provides them for free. And if anyone at home has this cyclical fever — please tell your parents right away to visit the PHC for a free blood test.

Remember: One net, one test, one cure. Let's be malaria warriors! Thank you!`,
      'Maternal & Pregnant Women': `Dear sisters, malaria is one of the most serious risks we face during pregnancy. But I want to reassure you — with the right precautions, you and your baby can stay safe.

Please collect your LLIN mosquito net from your ASHA worker today, if you haven't already. Use it every single night. If you experience any fever or chills, no matter how mild, please contact your ASHA worker or call 104 immediately.

We have safe, effective malaria treatment available at your PHC that is carefully designed for pregnant women. Your health and your child's health are our highest priority. Thank you.`,
    },
  },
  'Universal Childhood Immunization': {
    'SMS': {
      'General Public': `🩺 IMMUNIZATION REMINDER | Mission Indradhanush
Is your child (under 5) fully vaccinated?
✅ Free vaccines: BCG, OPV, DPT, Hep-B, Measles, Pentavalent
📅 Next session: Check with your ASHA worker or Anganwadi
📞 Call 104 | Visit nhp.gov.in
Protect your child. Vaccinate today.`,
      'School Children': `📚 VACCINATION DRIVE ALERT
Dear Students & Parents:
Mission Indradhanush vaccination camp at your school this week!
✅ Bring your immunization card
✅ No fee required
✅ Safe vaccines approved by CDSCO India
Questions? Call 104.`,
      'Maternal & Pregnant Women': `👶 PREGNANCY IMMUNIZATION ADVISORY
Protect your unborn baby:
✅ Tetanus Toxoid (TT) — 2 doses during pregnancy (FREE)
✅ Influenza vaccine recommended in 2nd trimester
Visit your ANM/ASHA for your immunization schedule.
📞 104 for queries.`,
    },
    'WHATSAPP': {
      'General Public': `*💉 Universal Immunization Programme (UIP)*
*Mission Indradhanush — Free for All Children*

Every child deserves protection. The Government of India provides 12 life-saving vaccines FREE to all children under 5.

*Free Vaccines Include:*
• BCG (TB protection)
• OPV (Polio)
• DPT (Diphtheria, Pertussis, Tetanus)
• Hepatitis B
• Measles-Rubella (MR)
• Pentavalent vaccine

*Where to vaccinate:*
🏥 Nearest PHC or Anganwadi Centre
📅 Sessions every Tuesday and Friday

*Track your child's immunization on CoWIN/U-WIN portal.*
📞 Queries: 104`,
      'School Children': `*🏫 School Vaccination Campaign*

Dear Students and Parents 👋

A *free vaccination drive* is coming to your school under *Mission Indradhanush*!

What to bring:
📋 Child's immunization card (if available)
✍️ Consent form signed by parent/guardian

All vaccines are:
✅ Approved by CDSCO India
✅ Completely free
✅ Administered by trained health workers

*Protect your child. Build herd immunity. Save lives.*
📞 Questions? Call 104.`,
      'Maternal & Pregnant Women': `*🤰 Immunization During Pregnancy*

Dear expectant mother,

Vaccinating during pregnancy protects both you and your newborn.

*Vaccines Recommended:*
💉 Tetanus Toxoid (TT-1 and TT-2) — Mandatory, free at PHC
💉 Influenza vaccine — Recommended in 2nd trimester
💉 Tdap vaccine — Protects newborn from whooping cough

*All vaccines are safe during pregnancy and provided FREE.*

Visit your ANM/ASHA worker or nearest PHC for your schedule.
📞 104 for guidance.`,
    },
    'SPEECH': {
      'General Public': `Respected community members, today we speak about the most powerful health tool ever created for our children — vaccines.

Mission Indradhanush, our national immunization programme, offers 12 life-saving vaccines completely free to every child under 5 years of age. These vaccines protect against diseases like tuberculosis, polio, diphtheria, measles, and hepatitis B — diseases that once took millions of young lives.

I urge every parent: Please check your child's immunization card. If any vaccine is missing — visit your nearest Anganwadi or PHC on any Tuesday or Friday. Our ASHA workers are ready to help you identify any gaps.

Immunization is not just for your child. When enough children are vaccinated, the whole community is protected. Let us vaccinate every child, leave no one behind. Thank you.`,
      'School Children': `Good morning everyone! Raise your hand if you've received your vaccines! 🙌

Vaccines are like a training camp for your immune system. They teach your body to fight dangerous diseases without actually getting sick.

Did you know? Polio — which could leave children paralyzed for life — has been completely eliminated from India because of the polio vaccine. That is the power of immunization!

Your school is hosting a free vaccination camp this week. Please bring your immunization card. If you don't have one, don't worry — the health worker will help you.

Remember: One small injection today can save you from a lifetime of illness. Be brave, get vaccinated! Thank you!`,
      'Maternal & Pregnant Women': `Dear sisters, pregnancy is a beautiful journey, and protecting your health during this time is protecting two lives — yours and your baby's.

The Government of India provides free Tetanus Toxoid injections — two doses during pregnancy — at every PHC and sub-centre. These are essential to prevent neonatal tetanus, which can be fatal to newborns.

I also encourage you to ask your ASHA worker about the influenza vaccine, which is safe and recommended during your second trimester, and the Tdap vaccine which protects your newborn from whooping cough in their first weeks of life.

Your ANM and ASHA worker will guide you through every step. Please do not hesitate to reach out to them. Thank you for taking care of yourself and your little one.`,
    },
  },
  'ORS & Hydration (ADD Prevention)': {
    'SMS': {
      'General Public': `💧 DIARRHOEA ALERT | WHO-ICMR Protocol
Monsoon increases risk of acute diarrhoeal disease (ADD).
✅ Prepare ORS: 1L clean water + 6 tsp sugar + ½ tsp salt
✅ Free ORS packets available at all PHCs & ASHA workers
✅ 3+ loose stools/day? → Visit PHC immediately
📞 104 for health guidance
– District Health Officer`,
      'School Children': `🏫 HYDRATION ALERT FOR STUDENTS
Drink only clean/boiled water at school.
✅ If diarrhoea starts: ORS immediately (ask parents)
✅ Wash hands with soap before eating
✅ Avoid street food during monsoon
Free ORS at school health room. Stay hydrated!`,
      'Maternal & Pregnant Women': `👶 DIARRHOEA IN PREGNANCY — ACT FAST
Dehydration during pregnancy is dangerous.
✅ At first sign of diarrhoea: Start ORS immediately
✅ Drink at least 3 litres of fluids per day
✅ Call ASHA or dial 104 if vomiting prevents oral intake
Free ORS and IV hydration at nearest PHC. Don't wait.`,
    },
    'WHATSAPP': {
      'General Public': `*💧 Diarrhoea Prevention & ORS Guide*
*WHO Oral Rehydration Therapy Protocol*

Acute diarrhoeal disease (ADD) kills 200,000+ children globally each year. ORS prevents 93% of diarrhoea deaths.

*How to Prepare ORS at Home:*
🫙 1 litre of clean or boiled water
🧂 ½ level teaspoon of salt
🍬 6 level teaspoons of sugar
Stir until dissolved. Give sip by sip.

*When to Seek Care:*
🔴 More than 3 loose stools per day
🔴 Blood in stool
🔴 Child refuses to drink
🔴 Signs of dehydration (sunken eyes, dry mouth, no tears)

*Free ORS packets at all PHCs and ASHA workers.*
📞 Call 104 for guidance.`,
      'School Children': `*🏫 ORS & Hydration: School Health Guide*

Dear Students 👋

Monsoon means delicious rain but also diarrhoea risks. Here's how to stay safe:

*Rule 1: Clean Water Only*
Drink only boiled or filtered water at school and at home.

*Rule 2: Hand Hygiene*
Wash hands with soap before eating and after using the toilet.

*Rule 3: Know ORS*
If diarrhoea starts: ORS (salt + sugar + water) stops dehydration fast.
Recipe: 1 glass water + pinch salt + 1 tsp sugar.

*Free ORS packets available at your school health room.*
📞 Parents: Call 104 for health guidance.`,
      'Maternal & Pregnant Women': `*🤰 Diarrhoea During Pregnancy — Emergency Guide*

Dear expectant mother,

Diarrhoea and dehydration during pregnancy can be dangerous for both you and your baby.

*Act Immediately:*
💧 Start ORS at the first sign of loose stools
🍌 Eat bland foods: rice, banana, curd, boiled potato
🚫 Avoid spicy food, raw vegetables, street food

*Prepare ORS:*
1 litre clean water + 6 tsp sugar + ½ tsp salt

*Go to PHC If:*
🔴 Vomiting prevents you from drinking
🔴 Diarrhoea for more than 24 hours
🔴 You feel dizzy, faint, or have no urine for 6+ hours

*Free IV hydration and ORS available at all PHCs.*
📞 Call 104 immediately if symptoms worsen.`,
    },
    'SPEECH': {
      'General Public': `Respected citizens, today I want to talk about a simple solution that has saved more lives than almost any medical invention — Oral Rehydration Solution, or ORS.

Every year during monsoon, thousands of people — especially children — die from dehydration caused by diarrhoea. Yet the solution is as simple as water, salt, and sugar.

Here is the formula: Take one litre of clean or boiled water. Add six level teaspoons of sugar and half a teaspoon of salt. Stir it well. Give this solution sip by sip to anyone who has diarrhoea. This prevents dehydration and saves lives.

Free ORS packets are available at your nearest PHC and with every ASHA worker. Please collect them and keep them at home. Do not wait for diarrhoea to strike before finding out about ORS. Be prepared. Thank you.`,
      'School Children': `Good morning, friends! Let me ask you a question — what is the most important nutrient your body needs every single day? Water! And today I'm going to teach you something that could save a life — even your own.

When someone has diarrhoea, they lose water and salts from their body very quickly. This is called dehydration, and it can be fatal. But there's a simple recipe that stops it: ORS — Oral Rehydration Solution.

Here's the recipe: One glass of clean water, a small pinch of salt, and one teaspoon of sugar. Mix it and drink it slowly. It replaces everything the body loses.

During this monsoon: Drink only clean water, wash your hands before eating, and avoid street food. Your school health room has free ORS packets. Stay hydrated, stay healthy! Thank you!`,
      'Maternal & Pregnant Women': `Dear sisters, during your pregnancy, your body needs more water than ever. Diarrhoea and vomiting during pregnancy can quickly lead to dangerous dehydration — for both you and your growing baby.

At the very first sign of loose stools, please start ORS immediately. The formula is simple: one litre of clean boiled water, six teaspoons of sugar, and half a teaspoon of salt. Drink it slowly throughout the day.

If you cannot keep fluids down due to vomiting, please go to your nearest PHC immediately. We have IV hydration ready for you, completely free. Dehydration in pregnancy should never be ignored.

Your ASHA worker has ORS packets and can come to your home. Do not hesitate to call her or dial 104. Your health is our priority, always. Thank you.`,
    },
  },
};

export async function getCampaigns(req: Request, res: Response, next: NextFunction) {
  try {
    const campaigns = await campaignRepository.getAll();
    return res.status(200).json({ success: true, data: { campaigns } });
  } catch (error) {
    next(error);
  }
}

export async function createCampaign(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, block, diseaseTag, channel, recipientCount } = req.body;
    const newCampaign = await campaignRepository.create({
      district: district || 'Pune',
      block,
      diseaseTag: diseaseTag || 'Dengue Awareness',
      channel: channel || 'SMS',
      recipientCount: recipientCount || 10000,
      status: 'DISPATCHED',
    });
    return res.status(201).json({ success: true, data: { campaign: newCampaign } });
  } catch (error) {
    next(error);
  }
}

export async function generateCampaignContent(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic = 'Dengue Prevention', channel = 'SMS', audience = 'General Public' } = req.body;

    const systemInstruction = `You are a Senior Public Health Communication Consultant. Your job is to generate compliant, verified awareness campaign text for MoHFW India. Never diagnose or prescribe medicines. All content must direct citizens to nearest Primary Health Centre (PHC) and official help hotlines like 104 / 108. Keep text under strict length limits (160 characters for SMS).`;

    const prompt = `Generate public health campaign text for:
- Topic: ${topic}
- Communication Channel: ${channel} (e.g. SMS, WHATSAPP, SPEECH)
- Target Audience: ${audience}

Rules:
1. SMS: Must be one short message (under 160 chars). Include a helpline like "Call 104 for help".
2. WHATSAPP: Use bold text (e.g. *Title*) and clean emojis. Highlight source reduction, vaccination, or ORS benefits.
3. SPEECH: Provide 3 short paragraphs of addressable script for school/community assembly.
4. Ground content in NVBDCP / WHO protocols. Never prescribe drugs.`;

    let content = '';
    let generatedBy = 'Google Gemini (gemini-1.5-flash)';

    try {
      content = await geminiService.generateText(prompt, systemInstruction);
    } catch (apiError) {
      // Fallback to pre-compiled CONTENT_LIBRARY if Gemini fails
      const topicContent = CONTENT_LIBRARY[topic];
      if (topicContent) {
        const channelContent = topicContent[channel];
        if (channelContent) {
          content = channelContent[audience] || channelContent['General Public'];
          generatedBy = 'ICMR Static Ground-Truth (Offline Fallback)';
        }
      }
    }

    if (!content) {
      return res.status(400).json({ success: false, message: 'Could not generate campaign content.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        content,
        metadata: {
          topic,
          channel,
          audience,
          groundedIn: 'NVBDCP, ICMR, WHO, NHM India',
          generatedAt: new Date().toISOString(),
          characterCount: content.length,
          generatedBy,
          disclaimer: 'This content is for public health awareness only. Not a substitute for professional medical advice.',
        },
      },
    });
  } catch (error) {
    next(error);
  }
}



