import { GlossaryTerm } from '../types';

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Output vs. Outcome',
    category: 'PM',
    definition: 'An output is what you build or ship (e.g., a mobile app feature, 50,000 downloads). An outcome is the measurable behavioral change or human benefit resulting from that output (e.g., 25% higher cassava yield, 40% reduction in chemical spend).',
    example: 'Shipping a weather widget is an output; farmers planting 3 days earlier and saving seeds is an outcome.',
  },
  {
    term: 'North Star Metric (NSM)',
    category: 'PM',
    definition: 'The single key metric that best captures the core value your product delivers to customers. It guides long-term sustainable growth.',
    example: 'For an advisory app: "Hectares of smallholder land actively farmed with AI-verified pest-free harvest" rather than "Daily Active Users".',
  },
  {
    term: 'RICE Prioritization',
    category: 'PM',
    definition: 'A scoring framework used to prioritize features: (Reach × Impact × Confidence) / Effort. Helps eliminate stakeholder opinion bias.',
    example: 'Reach (farmers reached/quarter) × Impact (1-3 scale) × Confidence (50-100%) / Effort (developer weeks).',
  },
  {
    term: 'MoSCoW Method',
    category: 'PM',
    definition: 'Categorizes product backlog items into Must Have, Should Have, Could Have, and Won’t Have for a specific release or sprint.',
    example: 'Offline photo caching is Must-Have for rural fields; voice avatar animation is Won’t-Have for MVP.',
  },
  {
    term: 'Product Discovery',
    category: 'PM',
    definition: 'The continuous process of discovering what to build through farmer interviews, prototyping, and hypothesis validation before writing code.',
    example: 'Shadowing women maize farmers during midday weeding to uncover daylight glare issues before designing UI.',
  },
  {
    term: 'Edge AI / On-Device Inference',
    category: 'AI & ML',
    definition: 'Running machine learning models locally on mobile devices or IoT gateways without sending data to cloud servers.',
    example: 'Running a lightweight TensorFlow Lite or ONNX model to identify Fall Armyworm inside fields with zero 2G/3G connectivity.',
  },
  {
    term: 'Precision vs. Recall',
    category: 'AI & ML',
    definition: 'Precision: Out of all crops flagged as diseased, how many actually are? Recall: Out of all diseased crops in the field, how many did the model catch?',
    example: 'In high-value disease detection, high recall is crucial—missing a contagious blight can destroy a whole village harvest.',
  },
  {
    term: 'Confidence Threshold',
    category: 'AI & ML',
    definition: 'The probability score above which an AI model triggers an alert or recommendation (e.g., only advise chemical treatment if confidence > 85%).',
    example: 'If confidence is below 70%, instead of guessing, the app asks the farmer to take a clearer close-up or consult a human extension agent.',
  },
  {
    term: 'Grounding & Hallucination',
    category: 'AI & ML',
    definition: 'Grounding connects GenAI responses to verified agronomic literature, avoiding hallucinated recommendations like advising toxic chemical dosages.',
    example: 'Injecting verified FAO / IITA integrated pest management guidelines into system instructions.',
  },
  {
    term: 'Multi-Sensor Fusion',
    category: 'Agri-Tech',
    definition: 'Combining multiple distinct data sources (soil moisture sensors, satellite NDVI, hyper-local weather stations, farmer logs) to generate high-fidelity guidance.',
    example: 'Predicting irrigation needs using soil water tension + evapotranspiration + 48-hour rain forecasts.',
  },
  {
    term: 'NDVI (Normalized Difference Vegetation Index)',
    category: 'Agri-Tech',
    definition: 'A numerical indicator derived from satellite or drone multispectral imagery measuring plant greenness, vigor, and chlorophyll density.',
    example: 'Detecting early nitrogen deficiency in a 5-hectare maize parcel 10 days before visible leaf yellowing.',
  },
  {
    term: 'IPM (Integrated Pest Management)',
    category: 'Agri-Tech',
    definition: 'An ecosystem-based strategy focusing on long-term prevention of pests through biological control, habitat manipulation, and cultural practices before synthetic pesticides.',
    example: 'Recommending neem oil or pheromone traps first, reserving synthetic chemicals only as a last resort.',
  },
  {
    term: 'USSD (Unstructured Supplementary Service Data)',
    category: 'Field & Ethics',
    definition: 'A GSM communications protocol used by basic feature phones without internet access (e.g., dialing *384#).',
    example: 'Enabling remote farmers with $15 Nokia feature phones to query AI disease alerts via interactive text menus.',
  },
  {
    term: 'Farmer Data Sovereignty',
    category: 'Field & Ethics',
    definition: 'The principle that farmers own their agricultural data (soil tests, yield logs, GPS coordinates) and must give informed consent for its aggregation or commercial use.',
    example: 'Preventing seed conglomerates from using farmer yield telemetry to arbitrarily inflate localized fertilizer prices.',
  },
  {
    term: 'Algorithmic Bias in Agriculture',
    category: 'Field & Ethics',
    definition: 'When AI models trained on commercial monocultures (e.g., US Midwest corn) fail or produce catastrophic errors when applied to intercropped smallholdings.',
    example: 'A pest model trained only on monoculture maize misclassifying intercropped bean foliage as weed infestation.',
  },
];
