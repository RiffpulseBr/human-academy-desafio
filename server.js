const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Importa o SDK
const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(express.json());
app.use(express.static('public'));

// Inicializa o Google AI com a sua chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/adapt', async (req, res) => {
    const { text, targetNetwork } = req.body;

    if (!text || !targetNetwork) {
        return res.status(400).json({ error: 'Texto e rede alvo são obrigatórios.' });
    }

    const prompts = {
        instagram: "Aja como um copywriter de elite especialista em Instagram. Escreva APENAS o texto final do post, pronto para ser copiado e colado. NÃO inclua rótulos estruturais como 'Gancho', 'Corpo' ou 'CTA'. Escreva um texto fluido que já comece com um gancho forte, desenvolva com emojis, termine com uma chamada para ação natural e coloque 5 hashtags no final. Texto base:\n\n",
        
        x: "Aja como um copywriter especialista em viralizar no X (Twitter). Escreva APENAS o texto final da Thread, pronto para copiar e colar. NÃO use rótulos ou explicações. Formate diretamente como uma Thread concisa de no máximo 4 posts, separando-os por quebras de linha e numerando (ex: 1/4). Texto base:\n\n",
        
        linkedin: "Aja como um copywriter especialista em LinkedIn. Escreva APENAS o texto final do post, pronto para copiar e colar. NÃO inclua rótulos estruturais. Escreva um texto fluido, profissional e autêntico, usando storytelling e boas quebras de linha para escaneabilidade. Termine com 3 hashtags. Texto base:\n\n"
    };

    try {
        // O SDK lida automaticamente com qual é a melhor versão da API por debaixo dos panos
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const finalPrompt = prompts[targetNetwork] + text;
        
        // Faz a chamada para a IA
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const generatedText = response.text();

        res.json({ result: generatedText });
    } catch (error) {
        console.error('Erro na IA:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));