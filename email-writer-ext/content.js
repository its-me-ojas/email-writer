console.log("Email Writer Extension -> content script loaded");

function findComposeToolbar() {
  const selectors = [
    ".btC",
    ".aDh",
    ".aDj",
    ".aDg",
    ".HE",
    ".aC4",
    ".ahe",
    '[role="toolbar"]',
    ".gU.Up",
  ];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
  return null;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return "";
}

function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI reply");
  button.classList.add("ai-reply-button");

  button.addEventListener("click", async function () {
    try {
      this.innerHTML = "Generating...";
      this.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("API Request Failed");
      }

      const generatedEmail = await response.text();
      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]',
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedEmail);
      } else {
        console.error("Compose box was not found");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate reply");
    } finally {
      this.innerHTML = "AI Reply";
      this.disabled = false;
    }
  });

  return button;
}

function injectButton() {
  const existingButton = document.querySelector(".ai-reply-button");
  if (existingButton) {
    existingButton.remove();
  }

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found, creating AI button");
  const button = createAIButton();
  console.log("Button created:", button);

  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]')),
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
