
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIStylistRecommendation = async (userInput: string, products: Product[], imageData?: string) => {
  const model = "gemini-3-flash-preview";
  
  const catalogContext = JSON.stringify(products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description
  })));

  const systemInstruction = `
    あなたは「Lumina Luxe」の高級パーソナルスタイリストです。
    ユーザーの要望やファッションの好みを分析し、私たちのカタログから最適な1〜3点の商品を提案してください。
    
    カタログ: ${catalogContext}
    
    必ず以下のJSON形式で、日本語で回答してください：
    {
      "explanation": "なぜそのスタイルがユーザーに合うのか、洗練されたエレガントな日本語で解説してください。",
      "recommendedProductIds": ["id1", "id2"],
      "stylingTips": ["着こなしのアドバイス1", "着こなしのアドバイス2"]
    }
  `;

  const contents: any[] = [{ text: userInput }];
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          recommendedProductIds: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          stylingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["explanation", "recommendedProductIds", "stylingTips"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AIレスポンスの解析に失敗しました", e);
    return null;
  }
};

export const chatWithSupport = async (message: string, products: Product[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "あなたはLumina Luxeの専属AIコンシェルジュ「Lumina」です。丁寧で洗練された日本語で顧客対応を行ってください。最新の商品リストはこちらです: " + JSON.stringify(products),
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
