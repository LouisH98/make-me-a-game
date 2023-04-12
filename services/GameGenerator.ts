import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-aVOE3PdwoSVxB68XSGTyE2bK",
  apiKey: process.env.OPENAI_API_KEY,
});

export class GameGenerator {
  openai: OpenAIApi;
  configuration: Configuration;

  constructor() {
    this.configuration = new Configuration({
      organization: "org-aVOE3PdwoSVxB68XSGTyE2bK",
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
  }

  async generateGameScript(
    gameDescription: string
  ): Promise<{ game: string; instructions: string }> {
    const systemPrompt = `You are a game developer that makes games for the web.
    There is a canvas the the id 'game-canvas' which you should use as a place to render the game. No external libraries should be used.
    You may use any keys on the keyboard and mouse buttons. 
    If you need to show scores, then you may use the element with id 'score' to show the score.
    
    The output of the game should be a JavaScript file that can be run in a browser.
    The game should be a single player game.
    The canvas is 500px by 500px.
    The game should not reload the page.
    Do not use the alert function.
    
    Your response should be ONLY valid JavaScript - this is very important.

    The next message you receive will be the game description. Please use this to create the game.
    `;

    const codeCompletion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: systemPrompt },
        { role: "user", content: gameDescription },
      ],
    });

    const javaScript = codeCompletion.data.choices[0].message?.content ?? "";

    const instructions = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: systemPrompt },
        { role: "user", content: gameDescription },
        { role: "assistant", content: javaScript },
        {
          role: "user",
          content: "Now tell me the instructions for the game.",
        },
      ],
    });

    return {
      game: javaScript,
      instructions: instructions.data.choices[0].message?.content ?? "",
    };
  }
}
