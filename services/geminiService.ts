import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, Itinerary } from "../types.ts";
import { ARTISANS, GUIDES, ACCOMMODATIONS } from "../constants.tsx";

// In a real app, you'd use a more secure way to handle API keys,
// but for this project, we'll assume it's set in the environment.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. Gemini features will use mock data.");
}

const MOCK_ITINERARY: Itinerary = {
  title: "Mocked Majesty: A Taste of Morocco",
  description: "This is a sample itinerary because the API key is not configured. It showcases the structure of an AI-generated luxury tour.",
  days: [
    {
      day: 1,
      title: "Arrival in Marrakech & Riad Retreat",
      summary: "Settle into the vibrant Red City.",
      activities: [
        { time: "Afternoon", description: "Private transfer and check-in at your luxury suite at Riad Yasmine.", type: "Accommodation" },
        { time: "Evening", description: "Welcome dinner at Le Foundouk, experiencing modern Moroccan cuisine.", type: "Dining" }
      ]
    },
    {
      day: 2,
      title: "Exploring the Medina's Heart",
      summary: "Dive deep into the history of Marrakech.",
      activities: [
        { time: "Morning", description: "Guided tour of the Bahia Palace and Saadian Tombs with Leila Alaoui.", type: "Tour" },
        { time: "1:00 PM", description: "Lunch at a rooftop cafe overlooking Jemaa el-Fnaa.", type: "Dining" },
        { time: "Afternoon", description: "Explore the souks with a focus on artisan crafts, including a visit to Youssef Amine's leather workshop.", type: "Activity" }
      ]
    }
  ]
};

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and appealing title for the entire travel itinerary."
    },
    description: {
      type: Type.STRING,
      description: "A short, engaging paragraph summarizing the trip's theme and highlights."
    },
    days: {
      type: Type.ARRAY,
      description: "An array of daily plans.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number, starting from 1." },
          title: { type: Type.STRING, description: "A catchy title for the day's theme (e.g., 'Marrakech Medina Magic')." },
          summary: { type: Type.STRING, description: "A brief one-sentence summary of the day's focus." },
          activities: {
            type: Type.ARRAY,
            description: "A list of activities for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Approximate time for the activity (e.g., 'Morning', '1:00 PM', 'Evening')." },
                description: { type: Type.STRING, description: "A detailed description of the activity or dining experience." },
                type: {
                  type: Type.STRING,
                  description: "The type of activity.",
                  enum: ['Dining', 'Tour', 'Activity', 'Accommodation', 'Free Time']
                },
              },
              required: ['time', 'description', 'type'],
            },
          },
        },
        required: ['day', 'title', 'summary', 'activities'],
      },
    },
  },
  required: ['title', 'description', 'days'],
};

const createPrompt = (preferences: UserPreferences): string => {
  const verifiedArtisans = ARTISANS.filter(a => a.isVerified).map(a => ({ name: a.name, craft: a.craft, location: a.location }));
  const verifiedGuides = GUIDES.filter(g => g.isVerified).map(g => ({ name: g.name, specialty: g.specialty, location: g.location }));
  const verifiedAccommodations = ACCOMMODATIONS.filter(a => a.isVerified).map(a => ({ name: a.name, type: a.type, location: a.location }));

  return `
    You are the "MarocSphere AI Travel Genie," the exclusive AI concierge for a luxury travel ecosystem focused on MARRAKECH, MOROCCO. Your primary goal is to create bespoke itineraries within Marrakech and its immediate surroundings (e.g., day trips to the Atlas Mountains) that showcase MarocSphere's network of VERIFIED partners.

    Client Preferences:
    - Destination: ${preferences.destination}
    - Duration: ${preferences.duration} days.
    - Interests: ${preferences.interests.join(", ")}.
    - Travel Style: ${preferences.travelStyle}.

    Your network of VERIFIED MarocSphere partners is listed below. You MUST prioritize and integrate these specific partners into the itinerary wherever relevant. When recommending a hotel, guide, or artisan experience, explicitly name them in the activity description.

    VERIFIED ACCOMMODATIONS:
    ${JSON.stringify(verifiedAccommodations, null, 2)}

    VERIFIED GUIDES:
    ${JSON.stringify(verifiedGuides, null, 2)}

    VERIFIED ARTISANS (for shopping or activity recommendations):
    ${JSON.stringify(verifiedArtisans, null, 2)}

    Your task:
    1.  Generate a complete, day-by-day luxury itinerary for Marrakech.
    2.  Explicitly mention verified partners in the 'description' of activities. For example: "Private guided tour of the Majorelle Garden with Leila Alaoui." or "Check into your luxury suite at Riad Yasmine."
    3.  Ensure the itinerary is logical, inspiring, and reflects the client's style and interests.
    4.  Produce a JSON output that strictly adheres to the provided schema. Do not output any other text or markdown.
  `;
};

export const generateItinerary = async (preferences: UserPreferences): Promise<Itinerary> => {
  if (!ai) return Promise.resolve(MOCK_ITINERARY);
  const prompt = createPrompt(preferences);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text?.trim() ?? '{}';
    const itineraryData = JSON.parse(jsonText);

    // Basic validation
    if (!itineraryData.title || !itineraryData.days || !Array.isArray(itineraryData.days)) {
        throw new Error("Invalid itinerary structure received from API.");
    }

    return itineraryData as Itinerary;
  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    throw new Error("Failed to communicate with the AI Travel Genie.");
  }
};

export const refineItinerary = async (currentItinerary: Itinerary, changeRequest: string): Promise<Itinerary> => {
    const verifiedArtisans = ARTISANS.filter(a => a.isVerified).map(a => ({ name: a.name, craft: a.craft, location: a.location }));
    const verifiedGuides = GUIDES.filter(g => g.isVerified).map(g => ({ name: g.name, specialty: g.specialty, location: g.location }));
    const verifiedAccommodations = ACCOMMODATIONS.filter(a => a.isVerified).map(a => ({ name: a.name, type: a.type, location: a.location }));

  if (!ai) {
    // Mock refinement for demo
    const updatedItinerary = { ...currentItinerary };
    updatedItinerary.description += `

Refined based on request: "${changeRequest}"`;
    return Promise.resolve(updatedItinerary);
  }

  const prompt = `
    You are refining an existing itinerary for MarocSphere.

    Current Itinerary:
    ${JSON.stringify(currentItinerary, null, 2)}

    Client Request: "${changeRequest}"

    Your network of VERIFIED MarocSphere partners is listed below. You MUST prioritize and integrate these specific partners into the itinerary wherever relevant. When recommending a hotel, guide, or artisan experience, explicitly name them in the activity description.

    VERIFIED ACCOMMODATIONS:
    ${JSON.stringify(verifiedAccommodations, null, 2)}

    VERIFIED GUIDES:
    ${JSON.stringify(verifiedGuides, null, 2)}

    VERIFIED ARTISANS (for shopping or activity recommendations):
    ${JSON.stringify(verifiedArtisans, null, 2)}

    Your task:
    1.  Refine the itinerary according to the client's request.
    2.  Explicitly mention verified partners in the 'description' of activities. For example: "Private guided tour of the Majorelle Garden with Leila Alaoui." or "Check into your luxury suite at Riad Yasmine."
    3.  Ensure the itinerary remains logical, inspiring, and reflects the client's style and interests.
    4.  Produce a JSON output that strictly adheres to the provided schema. Do not output any other text or markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text?.trim() ?? '{}';
    const itineraryData = JSON.parse(jsonText);

    // Basic validation
    if (!itineraryData.title || !itineraryData.days || !Array.isArray(itineraryData.days)) {
        throw new Error("Invalid itinerary structure received from API.");
    }

    return itineraryData as Itinerary;
  } catch (error) {
    console.error("Error refining itinerary with Gemini:", error);
    throw new Error("Failed to communicate with the AI Travel Genie.");
  }
};
