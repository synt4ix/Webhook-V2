<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Discord Components V2 Webhook Editor</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">V2</div>
        <div>
          <h1>Webhook Editor</h1>
          <p>Discord Components V2</p>
        </div>
      </div>

      <label class="field-label" for="webhookUrl">Webhook URL</label>
      <input id="webhookUrl" class="input" type="password" placeholder="https://discord.com/api/webhooks/..." autocomplete="off" />
      <button id="toggleWebhook" class="ghost-button" type="button">Show URL</button>

      <div class="button-grid">
        <button id="loadTemplate" type="button">Load Rules Template</button>
        <button id="formatJson" type="button">Format JSON</button>
        <button id="validateJson" type="button">Validate</button>
        <button id="copyJson" type="button">Copy JSON</button>
      </div>

      <button id="sendWebhook" class="send-button" type="button">Send Webhook</button>

      <section class="hint-box">
        <h2>Important</h2>
        <p>Components V2 must use <code>flags: 32768</code>.</p>
        <p>Do not use <code>content</code> or <code>embeds</code>. Put text inside <code>type: 10</code> components.</p>
      </section>
    </aside>

    <main class="editor-area">
      <div class="topbar">
        <div>
          <h2>Payload JSON</h2>
          <p>Edit your Discord Components V2 message here.</p>
        </div>
        <div id="statusPill" class="status-pill">Ready</div>
      </div>

      <textarea id="jsonEditor" spellcheck="false"></textarea>

      <section class="output-panel">
        <div class="output-header">
          <h2>Result</h2>
          <button id="clearOutput" class="ghost-button small" type="button">Clear</button>
        </div>
        <pre id="output">No output yet.</pre>
      </section>
    </main>
  </div>

  <script src="./app.js"></script>
</body>
</html>
