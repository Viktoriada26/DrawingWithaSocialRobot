"use strict";

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = 3000;

const clients = new Map();  

app.get("/sse/:streamId", (req, res) => {
  const { streamId } = req.params;

  res.writeHead(200, {
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });
  res.flushHeaders();

  
  res.write("event: CONNECTED\ndata: connected\n\n");

  
  if (!clients.has(streamId)) clients.set(streamId, []);
  clients.get(streamId).push(res);
  console.log(`Client connected for stream ${streamId}. Total: ${clients.get(streamId).length}`);

  
  req.on("close", () => {
    const arr = clients.get(streamId) || [];
    clients.set(streamId, arr.filter(r => r !== res));
    console.log(`Client disconnected from ${streamId}. Remaining: ${clients.get(streamId).length}`);
  });

  let counter = 0;
  let words = "";
  switch (streamId) {
    case "1":
      words = "Hello, |this |is |a |test| |[end]";
      break;
  }
  const wordlist = words.split("|");
  const interval = setInterval(() => {
    if (!wordlist[counter]) {
      clearInterval(interval);
      return;
    }
    let chunk;
    if (wordlist[counter] === "[end]") {
      chunk = `event: STREAMING_DONE\ndata:\n\n`;
    } else {
      chunk = `event: STREAMING_CHUNK\ndata:${wordlist[counter]}\n\n`;
    }
    res.write(chunk);
    counter++;
  }, 300);
});

//BUTTONS STDIN
process.stdin.setRawMode(true);
process.stdin.setEncoding("utf8");
console.log("Press SPACE for CORRECT, 'w' for WRONG, CTRL+C to exit");

process.stdin.on("data", (key) => {
  if (key === "\u0003") process.exit();       

  let evaluation;
  if (key === " ") {                           
    console.log("CORRECT");
    evaluation = { result: "correct" };
  } else if (key.toLowerCase() === "w") {      
    console.log("WRONG");
    evaluation = { result: "wrong" };
  } else {
    return;
  }

  for (const [streamId, resList] of clients.entries()) {
    const payload = `event: EVALUATION\ndata:${JSON.stringify(evaluation)}\n\n`;
    resList.forEach(res => res.write(payload));
  }
});

app.listen(PORT, () => {
  console.log(`SSE server listening on http://localhost:${PORT}`);
});
