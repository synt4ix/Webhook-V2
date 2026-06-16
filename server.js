const editor = document.querySelector("#jsonEditor");
const webhookInput = document.querySelector("#webhookUrl");
const statusPill = document.querySelector("#statusPill");
const output = document.querySelector("#output");

const rulesTemplate = {
  flags: 32768,
  allowed_mentions: {
    parse: []
  },
  components: [
    {
      type: 17,
      accent_color: 2171169,
      components: [
        {
          type: 9,
          components: [
            {
              type: 10,
              content: "# Social Entertainment Rules\nWelcome to the Social Entertainment Discord Server.\n\nBy staying in this server, you agree to follow these rules and help keep the community safe, respectful, and enjoyable for everyone."
            }
          ],
          accessory: {
            type: 2,
            style: 5,
            label: "Discord Terms",
            url: "https://discord.com/terms"
          }
        },
        {
          type: 14,
          spacing: 2,
          divider: true
        },
        {
          type: 10,
          content: "**Discord Terms of Service**\nAll members must follow Discord’s Terms of Service and Community Guidelines. Breaking Discord’s rules may result in removal from the server."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**Rule Violations**\nAll members are expected to follow the rules at all times. Trying to avoid, manipulate, or abuse loopholes in the rules is not allowed.\n\nStaff may take action against behavior that harms the server, even if it is not directly listed here."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**1. Respect and Behavior**\nTreat every member with respect and maturity. Harassment, insults, toxicity, threats, excessive arguing, or provoking others is not allowed."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**2. Hate Speech and Discrimination**\nHate speech, racism, sexism, homophobia, or targeted discrimination against any person or group is strictly prohibited. Severe violations may result in an immediate ban."
        }
      ]
    },
    {
      type: 17,
      accent_color: 2236962,
      components: [
        {
          type: 10,
          content: "**3. Spam and Advertising**\nSpamming, flooding chats, repeated messages, unnecessary pings, or disruptive behavior is not allowed.\n\nAdvertising, self promotion, server invites, or promotion of external projects requires staff permission."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**4. NSFW and Inappropriate Content**\nNSFW, explicit, disturbing, illegal, or highly inappropriate content is not allowed under any circumstances. This includes text, images, videos, usernames, profile pictures, and links."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**5. Staff Respect**\nRespect staff members and their decisions. Ignoring instructions, arguing excessively, spreading false claims, or disrespecting staff may lead to punishment.\n\nIf you believe a staff decision was unfair, use the proper support system instead of starting drama."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**6. Exploiting and Abuse**\nExploiting, cheating, abusing bugs, using scripts, attempting to harm the game, or encouraging others to do so is strictly forbidden.\n\nAny serious abuse may result in action being taken in both the Discord server and the game."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**7. Ban Evasion**\nUsing alternate accounts to bypass a mute, kick, ban, blacklist, or any other punishment is not allowed.\n\nBan evasion may result in a permanent ban from the server and the game."
        }
      ]
    },
    {
      type: 17,
      accent_color: 2171169,
      components: [
        {
          type: 10,
          content: "**8. Community Atmosphere**\nKeep conversations friendly, appropriate, and easy for others to take part in. Do not start drama, provoke arguments, spread rumors, or intentionally create negativity.\n\nEnglish is required in the main channels. Other languages should only be used in the correct international channels."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "**9. Enforcement**\nBy being part of this community, you agree to these rules.\n\nThe staff team may take action when needed to protect the server, the game, and the community. Punishments depend on the severity of the situation and may include warnings, mutes, kicks, bans, blacklists, or game related actions."
        },
        {
          type: 14,
          spacing: 1,
          divider: true
        },
        {
          type: 10,
          content: "Thank you for reading the rules. Please make sure you understand them before taking part in the community."
        },
        {
          type: 12,
          items: [
            {
              media: {
                url: "https://discord-webhook.com/uploads/c2870168a6950f80c71783488fa81f5d.webp"
              }
            }
          ]
        }
      ]
    }
  ]
};

function setStatus(text, type = "") {
  statusPill.textContent = text;
  statusPill.className = `status-pill ${type}`.trim();
}

function print(data) {
  output.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

function parseEditorJson() {
  try {
    return { ok: true, payload: JSON.parse(editor.value) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function formatEditorJson() {
  const parsed = parseEditorJson();
  if (!parsed.ok) {
    setStatus("Invalid JSON", "error");
    print(`JSON error: ${parsed.error}`);
    return;
  }

  editor.value = JSON.stringify(parsed.payload, null, 2);
  setStatus("Formatted", "success");
}

async function validatePayload() {
  const parsed = parseEditorJson();
  if (!parsed.ok) {
    setStatus("Invalid JSON", "error");
    print(`JSON error: ${parsed.error}`);
    return false;
  }

  const response = await fetch("/api/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: parsed.payload })
  });

  const data = await response.json();
  print(data);

  if (data.ok) {
    setStatus(`Valid · ${data.componentCount} components`, data.warnings?.length ? "warning" : "success");
    return true;
  }

  setStatus("Validation failed", "error");
  return false;
}

async function sendWebhook() {
  const parsed = parseEditorJson();
  if (!parsed.ok) {
    setStatus("Invalid JSON", "error");
    print(`JSON error: ${parsed.error}`);
    return;
  }

  if (!webhookInput.value.trim()) {
    setStatus("Webhook missing", "error");
    print("Paste your Discord webhook URL first.");
    return;
  }

  setStatus("Sending...", "warning");

  const response = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webhookUrl: webhookInput.value.trim(),
      payload: parsed.payload
    })
  });

  const data = await response.json();
  print(data);

  if (data.ok) {
    setStatus("Sent", "success");
  } else {
    setStatus("Send failed", "error");
  }
}

document.querySelector("#loadTemplate").addEventListener("click", () => {
  editor.value = JSON.stringify(rulesTemplate, null, 2);
  setStatus("Template loaded", "success");
  print("Rules template loaded.");
});

document.querySelector("#formatJson").addEventListener("click", formatEditorJson);
document.querySelector("#validateJson").addEventListener("click", validatePayload);
document.querySelector("#sendWebhook").addEventListener("click", sendWebhook);

document.querySelector("#copyJson").addEventListener("click", async () => {
  await navigator.clipboard.writeText(editor.value);
  setStatus("Copied", "success");
  print("JSON copied to clipboard.");
});

document.querySelector("#clearOutput").addEventListener("click", () => {
  print("No output yet.");
  setStatus("Ready");
});

document.querySelector("#toggleWebhook").addEventListener("click", (event) => {
  const isHidden = webhookInput.type === "password";
  webhookInput.type = isHidden ? "text" : "password";
  event.currentTarget.textContent = isHidden ? "Hide URL" : "Show URL";
});

editor.value = JSON.stringify(rulesTemplate, null, 2);
