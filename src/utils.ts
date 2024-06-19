require('dotenv').config()
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function commentFunction(word: string){
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: " You are code commenting bot. You will be given a code and you have to return a comment about what the code does." },{role: "user", content: `Can you return the comment in plain text?\nCode:\n${word}`}],
        model: "gpt-3.5-turbo-16k",
      });
    let commentLines = completion.choices[0].message.content!.split('.')
    commentLines = commentLines.map((line: string)=> '#'+line);
    const comment = commentLines.slice(0,-1).join('\n')

    return comment;
}

export {commentFunction}