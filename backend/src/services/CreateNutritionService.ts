import { DataProps } from "../controllers/CreateNutritionController";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

class CreateNutritionService {
    async execute({ name, age, gender, height, level, objective, weight }: DataProps){
        
        try {
            const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
            
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });

            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ];

            const prompt = `
                Crie um plano alimentar de um dia para uma pessoa com os seguintes dados:
                - Nome: ${name}
                - Sexo: ${gender}
                - Peso: ${weight} kg
                - Altura: ${height} cm
                - Idade: ${age} anos
                - Objetivo: ${objective}
                - Nível de atividade: ${level}

                O resultado DEVE ser um objeto JSON único. O JSON deve conter uma propriedade "refeicoes", que é um array de objetos.
                Cada objeto de refeição no array DEVE ter EXATAMENTE as seguintes propriedades, sem acentos nos nomes das chaves:
                - "id": uma string identificadora sem espaços (ex: "cafeDaManha", "almoco").
                - "nome": o nome da receita (ex: "Panqueca de farelo de aveia").
                - "categoria": o nome da refeição (ex: "Café da manhã").
                - "kcal": um número para as calorias totais.
                - "proteinas": um número para as proteínas em gramas.
                - "carboidratos": um número para os carboidratos em gramas.
                - "gorduras": um número para as gorduras em gramas.
                - "ingredientes": um array de objetos, onde cada objeto tem uma única propriedade "texto" (ex: [{ "texto": "1 ovo" }, { "texto": "1 colher de sopa de aveia" }]).
                - "tempoPreparo": uma string descrevendo o tempo (ex: "10-15 minutos").
                - "modoPreparo": um array de strings, onde cada string é um passo do preparo.
                
                Gere um plano completo para o dia todo com 5 a 6 refeições seguindo esta estrutura. O JSON final deve ser apenas o objeto contendo o array "refeicoes".
            `;
            
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                safetySettings,
            });

            const jsonText = result.response.text();
            
            // --- NOVA ETAPA DE LIMPEZA E DEBUG ---
            console.log("--- RESPOSTA BRUTA DA IA ---");
            console.log(jsonText);
            console.log("--- FIM DA RESPOSTA BRUTA ---");

            // Tenta extrair apenas o conteúdo entre a primeira '{' e a última '}'
            // Isso remove qualquer texto extra que a IA possa ter adicionado.
            const match = jsonText.match(/{[\s\S]*}/);

            if (!match) {
                throw new Error("Nenhum JSON válido encontrado na resposta da IA.");
            }

            const cleanedJson = match[0];
            const jsonObject = JSON.parse(cleanedJson);

            return { data: jsonObject };

        } catch(err) {
            console.error("ERRO AO GERAR CONTEÚDO OU FAZER PARSE DO JSON", err);
            throw new Error("Falha ao criar o plano alimentar.");
        }
    }
}

export { CreateNutritionService };