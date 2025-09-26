import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data for AI services.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateCreativeText = async (
  inputType,
  text
) => {
  if (!ai) {
    return `"${text}" 的 AI 模擬回覆。`;
  }

  let prompt = '';
  switch (inputType) {
    case 'post_title':
      prompt = `根據以下內容，生成一個簡潔且引人入勝的標題（繁體中文）。內容：「${text}」`;
      break;
    case 'qna_question':
      prompt = `以更清晰、更能引發思考的方式，改寫以下給新創團隊的問題（繁體中文）。問題：「${text}」`;
      break;
    case 'story_content':
      prompt = `將這個簡短的想法，擴寫成一段適合內部社群平台的、鼓舞人心的「靈機一動」短文（繁體中文）。想法：「${text}」`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating creative text:", error);
    return "AI 生成失敗";
  }
};


export const generateSeniorAdvisorSuggestion = async (
    post,
    user
) => {
    if (!ai) {
        return Promise.resolve(
            `作為一個資深的 ${user.role}，針對 "${post.title}" 專案，我建議我們可以從使用者研究開始，深入了解目標客群的真實痛點。接著，我們可以繪製使用者旅程圖，找出可以優化的關鍵接觸點。這將為我們的產品設計提供堅實的基礎。`
        );
    }
    
    const prompt = `
        你是一位在 startup 圈打滾多年，經驗非常豐富的「${user.role}」。
        針對以下的新專案點子，請提出一個具體、有深度、可執行的專業建議。
        你的建議應該要展現出你作為資深專家的洞察力，直接切入重點，提出下一步可以怎麼做。
        請用繁體中文回答。

        專案點子:
        - 標題: "${post.title}"
        - 內容: "${post.content}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating senior advisor suggestion:", error);
        return "AI 建議生成失敗，請檢查 API 金鑰。";
    }
};

export const createDiscussionChat = (suggestion) => {
    if (!ai) return null;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [{
            role: 'model',
            parts: [{ text: '對於這個建議，你有什麼初步的想法或疑問嗎？讓我們一起來探討看看。' }]
        }],
        config: {
            systemInstruction: `你是一個「高級問題討論師」。你的任務是引導使用者深入思考一個給定的建議。
            使用者會提供一個由「高級專家」給出的建議，然後和你進行討論。
            你的職責是：
            1. 提出批判性問題：針對建議中的假設、潛在風險或模糊之處提問。
            2. 拓展思路：從不同角度探討這個建議，提出替代方案或可能的改進方向。
            3. 保持客觀中立：你不是來反對建議的，而是幫助使用者把建議想得更周全。
            4. 鼓勵使用者發言：多用開放式問題，例如「你覺得這樣做可能會遇到什麼挑戰？」、「如果我們從另一個角度看呢？」。
            
            初始建議是： "${suggestion}"
            你現在要開始和使用者對話了。`
        }
    });
    return chat;
};
