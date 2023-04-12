import { GameGenerator } from "@/services/GameGenerator";

export async function POST(request: Request) {
  const gameGenerator = new GameGenerator();

  const { gameDescription } = await request.json();

  let gameAndInstructions = await gameGenerator.generateGameScript(
    gameDescription
  );

  return new Response(JSON.stringify(gameAndInstructions), {
    headers: { "Content-Type": "application/json" },
  });
}
