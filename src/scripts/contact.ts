let dispose: (() => void) | null = null;
let booted = false;

function initContact() {
  dispose?.();
  dispose = null;

  const copyBtn = document.getElementById("copy-email");
  const copyText = document.getElementById("copy-email-text");
  const shareBtn = document.getElementById("share-site");
  const shareText = document.getElementById("share-site-text");
  if (!copyBtn && !shareBtn) return;

  const ac = new AbortController();
  const { signal } = ac;
  const originalCopy = copyText?.textContent ?? "";
  const originalShare = shareText?.textContent ?? "";

  copyBtn?.addEventListener(
    "click",
    async () => {
      const email = copyBtn.getAttribute("data-email");
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
        if (copyText) {
          copyText.textContent = copyText.getAttribute("data-copied") || "✓ Copied!";
          window.setTimeout(() => {
            copyText.textContent = originalCopy;
          }, 2000);
        }
      } catch {
        // Clipboard may be blocked; ignore quietly
      }
    },
    { signal },
  );

  shareBtn?.addEventListener(
    "click",
    async () => {
      const title = shareBtn.getAttribute("data-share-title") || document.title;
      const text = shareBtn.getAttribute("data-share-text") || "";
      const url = shareBtn.getAttribute("data-share-url") || window.location.href;
      const copiedLabel = shareText?.getAttribute("data-copied") || "✓ Copied!";

      const flash = (label: string) => {
        if (!shareText) return;
        shareText.textContent = label;
        window.setTimeout(() => {
          shareText.textContent = originalShare;
        }, 2000);
      };

      try {
        if (typeof navigator.share === "function") {
          await navigator.share({ title, text, url });
          return;
        }
      } catch (error) {
        // User cancel should not fall through to clipboard
        if (error instanceof DOMException && error.name === "AbortError") return;
      }

      try {
        await navigator.clipboard.writeText(url);
        flash(copiedLabel);
      } catch {
        // Last resort: prompt so it still works everywhere
        window.prompt("Copy link:", url);
      }
    },
    { signal },
  );

  dispose = () => {
    ac.abort();
  };
}

export function bootContact() {
  if (booted) return;
  booted = true;
  document.addEventListener("astro:page-load", initContact);
  initContact();
}
