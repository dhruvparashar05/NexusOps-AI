import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Polyfill browser-specific rendering variables on the global Node.js context 
// to prevent ReferenceErrors during server-side compilation of pdf-parse
if (typeof global !== "undefined") {
  // @ts-ignore
  if (typeof global.DOMMatrix === "undefined") {
    // @ts-ignore
    global.DOMMatrix = class {};
  }
  // @ts-ignore
  if (typeof global.ImageData === "undefined") {
    // @ts-ignore
    global.ImageData = class {};
  }
  // @ts-ignore
  if (typeof global.Path2D === "undefined") {
    // @ts-ignore
    global.Path2D = class {};
  }
}

const pdf = eval("require('pdf-parse')");

function generateLocalChatFallback(prompt: string, knowledgeContext: string, errorDetail: string) {
  const query = prompt.toLowerCase().trim();
  
  let action = "NONE";
  let parameters: any = {};
  let replyText = "";
  
  if (query.includes("create") || query.includes("schedule") || query.includes("setup")) {
    action = "CREATE_EVENT";
    let eventTitle = "Offline Tourney";
    let eventGame = "clash";
    let eventTeams = 16;
    
    const matchQuote = prompt.match(/"([^"]+)"/) || prompt.match(/'([^']+)'/);
    if (matchQuote) {
      eventTitle = matchQuote[1];
    } else {
      const words = prompt.split(" ");
      const idx = words.findIndex(w => w.toLowerCase() === "tournament" || w.toLowerCase() === "event" || w.toLowerCase() === "cup");
      if (idx > 0) {
        eventTitle = words.slice(Math.max(0, idx - 2), idx + 1).join(" ");
      }
    }
    
    if (query.includes("val") || query.includes("valorant")) {
      eventGame = "valorant";
    } else if (query.includes("bgmi") || query.includes("pubg")) {
      eventGame = "bgmi";
    } else if (query.includes("free") || query.includes("ff")) {
      eventGame = "freefire";
    }
    
    const teamMatch = query.match(/(\d+)\s*team/);
    if (teamMatch) {
      eventTeams = parseInt(teamMatch[1]);
    }
    
    parameters = { eventTitle, eventGame, eventTeams };
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nI have locally parsed your command and scheduled the tournament:\n- **Event Name**: ${eventTitle}\n- **Game**: ${eventGame.toUpperCase()}\n- **Team Limit**: ${eventTeams} Teams\n\n*The bracket has been successfully initialized on your dashboard.*`;
  }
  else if (query.includes("cancel") || query.includes("delete") || query.includes("remove")) {
    action = "CANCEL_EVENT";
    let eventTitle = "";
    const matchQuote = prompt.match(/"([^"]+)"/) || prompt.match(/'([^']+)'/);
    if (matchQuote) {
      eventTitle = matchQuote[1];
    } else {
      eventTitle = prompt.replace(/(cancel|delete|remove|tournament|event)/gi, "").trim();
    }
    parameters = { eventTitle };
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nI have locally registered your request to cancel the tournament matching **"${eventTitle}"** and updated the active bracket standings.`;
  }
  else if (query.includes("go to") || query.includes("navigate") || query.includes("show") || query.includes("open") || query.includes("switch")) {
    action = "NAVIGATE_TAB";
    let targetTab = "dashboard";
    if (query.includes("analytics")) {
      targetTab = "analytics";
    } else if (query.includes("tournament") || query.includes("event") || query.includes("fixture")) {
      targetTab = "tournaments";
    } else if (query.includes("communit") || query.includes("integration") || query.includes("sync")) {
      targetTab = "communities";
    } else if (query.includes("announcement") || query.includes("news") || query.includes("broadcast")) {
      targetTab = "announcements";
    }
    parameters = { targetTab };
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nNavigating console terminal to the **${targetTab.toUpperCase()}** viewport tab.`;
  }
  else if (query.includes("publish") || query.includes("post") || query.includes("announce")) {
    action = "POST_ANNOUNCEMENT";
    let announcementText = "";
    const matchQuote = prompt.match(/"([^"]+)"/) || prompt.match(/'([^']+)'/);
    if (matchQuote) {
      announcementText = matchQuote[1];
    } else {
      announcementText = prompt.replace(/(publish|post|announce|announcement)/gi, "").trim();
    }
    parameters = { announcementText };
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nPublished the operational alert update: \n*"${announcementText}"*\n\n*The broadcast has been dispatched to Discord and active Telegram feeds.*`;
  }
  else if (query.includes("search") || query.includes("find") || query.includes("filter")) {
    action = "SEARCH_EVENTS";
    let searchQuery = "";
    const matchQuote = prompt.match(/"([^"]+)"/) || prompt.match(/'([^']+)'/);
    if (matchQuote) {
      searchQuery = matchQuote[1];
    } else {
      searchQuery = prompt.replace(/(search|find|filter|for)/gi, "").trim();
    }
    parameters = { searchQuery };
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nFiltered all console brackets matching search pattern: **"${searchQuery}"**.`;
  }
  else if (query.includes("clear") || query.includes("reset")) {
    action = "CLEAR_FILTER";
    replyText = `✨ **Offline Fallback Copilot Mode** (Google API Throttled/Unavailable - ${errorDetail})\n\nResetting all search indexes to display complete listings.`;
  }
  else {
    let matchFound = false;
    let snippet = "";
    if (knowledgeContext) {
      const paragraphs = knowledgeContext.split("\n\n");
      for (const para of paragraphs) {
        const words = query.split(" ").filter(w => w.length > 3);
        const matchCount = words.filter(w => para.toLowerCase().includes(w)).length;
        if (matchCount >= 2) {
          matchFound = true;
          snippet = para;
          break;
        }
      }
    }
    
    if (matchFound) {
      replyText = `✨ **Offline Fallback Copilot Mode** (Gemini API 503 Throttling - Rulebook scan used)\n\nAdler, I found a matching rule layout inside your local knowledge files:\n\n${snippet}\n\n*Note: Generative API queries are throttled, but local indexing continues to serve verified ground-truth contexts.*`;
    } else {
      replyText = `✨ **Offline Fallback Copilot Mode** (Gemini API 503 Throttling)\n\nAdler, the generative language server is currently experiencing temporary high demand and returned a **503 Service Unavailable** status. \n\nI am currently operating in offline mode. If you need to make changes, I can parse commands to **create tournaments**, **navigate screens**, **post alerts**, or **search rulebooks** using rule-based local heuristics. \n\nHow would you like to proceed?`;
    }
  }
  
  return { action, parameters, replyText };
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return Response.json({
        action: "NONE",
        replyText: "⚠️ **Gemini API Key is missing or using placeholder!**\n\nTo hook up your real Google Gemini model, please replace `YOUR_GEMINI_API_KEY_HERE` in your `.env.local` file in the root directory with a valid Gemini API Key.\n\n*In the meantime, the dashboard will fallback to standard operations parsing.*"
      }, { status: 200 });
    }

    // 1. Scan and read local knowledge base files (.md, .txt, or .pdf)
    let knowledgeContext = "";
    try {
      const kbPath = path.join(process.cwd(), "knowledge_base");
      if (fs.existsSync(kbPath)) {
        const files = fs.readdirSync(kbPath);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          const filePath = path.join(kbPath, file);
          if (ext === ".md" || ext === ".txt") {
            const content = fs.readFileSync(filePath, "utf-8");
            knowledgeContext += `\n=== FILE: ${file} ===\n${content}\n`;
          } else if (ext === ".pdf") {
            try {
              const dataBuffer = fs.readFileSync(filePath);
              const uint8data = new Uint8Array(dataBuffer);
              const parser = new pdf.PDFParse({ data: uint8data });
              await parser.load();
              const parsedRes = await parser.getText();
              knowledgeContext += `\n=== FILE: ${file} ===\n${parsedRes.text || ""}\n`;
              await parser.destroy();
            } catch (pdfErr) {
              console.error(`Failed to parse PDF file ${file}:`, pdfErr);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to read knowledge base files:", e);
    }

    const systemPrompt = `You are NEXUSOPS AI Copilot, a powerful operations assistant for a SaaS gaming tournament and event dashboard.
The user is Adler/Aditya, the administrator of the dashboard.
Your job is to assist Adler by executing natural language commands and replying to their queries.

You MUST respond strictly in JSON matching the following schema. Do NOT include any markdown code blocks (like \`\`\`json ... \`\`\`) or extra text outside the JSON. The JSON must be parseable directly.

JSON Response Schema:
{
  "action": "CREATE_EVENT" | "CANCEL_EVENT" | "NAVIGATE_TAB" | "POST_ANNOUNCEMENT" | "SEARCH_EVENTS" | "CLEAR_FILTER" | "NONE",
  "parameters": {
    "eventTitle": "extracted title of the tournament",
    "eventGame": "valorant" | "bgmi" | "clash" | "freefire",
    "eventTeams": number,
    "targetTab": "dashboard" | "analytics" | "tournaments" | "communities" | "announcements",
    "searchQuery": "search query string",
    "announcementText": "announcement body text"
  },
  "replyText": "your markdown formatted response to the user. Describe the action you took clearly and professionally."
}

Rules for Action Mapping:
1. If the user asks you to create/schedule a tournament or event, set "action" to "CREATE_EVENT" and fill "eventTitle" (string), "eventGame" (lowercase game type), "eventTeams" (integer, default 16).
2. If the user asks to cancel, delete, or remove an event/tournament, set "action" to "CANCEL_EVENT" and fill "eventTitle" with the name or part of the name of the tournament.
3. If the user asks you to navigate, show, open, switch, or go to a tab/screen (like dashboard, home, overview, analytics, tournaments, events, communities, integrations, settings, announcements), set "action" to "NAVIGATE_TAB" and fill "targetTab" (the tab slug).
4. If the user asks to publish, post, broadcast, or write an announcement, set "action" to "POST_ANNOUNCEMENT" and fill "announcementText".
5. If the user asks you to search, look up, find, or filter tournaments/events for a specific keyword, set "action" to "SEARCH_EVENTS" and fill "searchQuery".
6. If the user asks to clear filters, clear search, reset filter, or show all events, set "action" to "CLEAR_FILTER".
7. For all other queries (Q&A, general rules check, meeting audits, chat chit-chat), set "action" to "NONE".

Make sure your replyText is professional, using bullet points or markdown bolding where helpful, and clearly explaining what you've done.`;

    const fullPrompt = `${systemPrompt}\n\nHere is the community knowledge base context containing competitive tournament rulebooks uploaded by the administrator. Use these documents as direct ground-truth context to answer any user query, rule check, dispute, or team configuration:\n${knowledgeContext || "No custom rulebooks have been uploaded yet."}`;

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: fullPrompt },
              { text: `User message: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.warn("Gemini API call failed, using local offline fallback:", apiResponse.status, errorText);
      const fallback = generateLocalChatFallback(prompt, knowledgeContext, `Status: ${apiResponse.status}`);
      return Response.json(fallback);
    }

    const data = await apiResponse.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return Response.json({
        action: "NONE",
        replyText: "❌ **Empty response from Gemini!**\nPlease try again."
      }, { status: 200 });
    }

    try {
      const parsed = JSON.parse(responseText.trim());
      return Response.json(parsed);
    } catch (parseError) {
      // Safe fallback: strip markdown blocks if model wraps JSON inside them by accident
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      
      try {
        const parsedCleaned = JSON.parse(cleaned.trim());
        return Response.json(parsedCleaned);
      } catch (innerError) {
        return Response.json({
          action: "NONE",
          replyText: `❌ **JSON Parse Error!**\n\nFailed to parse model output.\nResponse content:\n\`\`\`\n${responseText}\n\`\`\``
        }, { status: 200 });
      }
    }

  } catch (err: any) {
    console.error("Internal Server Error in Chat API, using local fallback:", err);
    // Safe parse prompt to provide graceful offline fallback
    let localPrompt = "help";
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      if (body?.prompt) localPrompt = body.prompt;
    } catch (_) {}
    const fallback = generateLocalChatFallback(localPrompt, "", `Network Error: ${err?.message || err}`);
    return Response.json(fallback);
  }
}
