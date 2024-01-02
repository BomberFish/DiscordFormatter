const {
  SlashCommandBuilder,
  Routes,
  Client,
  MessageAttachment,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { token } = require("./auth.json");
const os = require("os");
const fs = require("fs");
var detectLang = require("lang-detector");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Bot ready!");
  client.user.setPresence({
    activities: [{ name: `with markdown`, type: ActivityType.Streaming }],
    status: "online",
  });
});

// Login to Discord with your client's token
client.login(token);
console.log(`Logged in!`);

client.on("messageCreate", async (message) => {
  console.log("[i] got message");
  if (message.author.bot) return;

  if (message.content.startsWith("pls format")) {
    console.log("[✅] received command with message id " + message.id);
    if (message.reference) {
      var lang = "";

      // The message is replying to another message
      const repliedMessage = await message.channel.messages.fetch(
        message.reference.messageId
      );
      console.log("[✅] formatting message with id " + repliedMessage.id);

      if (message.content !== "pls format") {
        lang = message.content.replace("pls format ", "");
      } else {
        console.log(detectLang(repliedMessage.content, { statistics: true }));
        switch (detectLang(repliedMessage.content)) {
          case "JavaScript":
            lang = "js";
            break;
          case "Python":
            lang = "py";
            break;
          case "Java":
            lang = "java";
            break;
          case "C++":
            lang = "cpp";
            break;
          case "C":
            lang = "c";
            break;
          case "HTML":
            lang = "html";
            break;
          case "CSS":
            lang = "css";
            break;
          case "PHP":
            lang = "php";
            break;
          case "Ruby":
            lang = "rb";
            break;
          case "Go":
            lang = "go";
            break;
        }
      }

      if (
        repliedMessage.content.startsWith("```") ||
        repliedMessage.content.endsWith("```")
      ) {
        // The message is already formatted
        message.reply("That message is already formatted!");
        return;
      }

      if (repliedMessage.content.length == 0 || repliedMessage.content == "") {
        // The message is empty
        message.reply("That message is empty!");
        return;
      }

      message.reply("```" + lang + "\n" + repliedMessage.content + "```");
    } else {
      // The message is not replying to another message
      message.reply("You need to reply to a message to format it!");
    }
  }
});

client.once("reconnecting", () => {
  console.log("Reconnecting...");
});
client.once("disconnect", () => {
  console.log("Disconnected!");
});
