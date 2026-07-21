import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export async function analyzeReceipt(base64Image: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = `
        Analyze this receipt. Itemize every purchase.
        Categorize each item strictly into ONE of these exact categories: 
        "Groceries", "Subscriptions", "Membership", "Bills", "Transport", "Dining", "Shopping", "Entertainment", "Rent".
        
        Return ONLY a valid JSON object with no markdown formatting.
        Use this exact structure:
        {
            "merchant": "Merchant Name or Unknown",
            "grandTotal": 150,
            "items": [
                {
                    "name": "tomatoes",
                    "amount": 30,
                    "category": "Groceries"
                }
            ]
        }
    `;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
        },
    };

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Gemini API Error:', error);
        return null;
    }
}