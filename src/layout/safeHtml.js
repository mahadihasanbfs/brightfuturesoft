// Rich text written by teammates (notices, task descriptions) is shown through this: only a safe set of tags
// and attributes survives, so a pasted <script> or onerror= can never run.
const ALLOWED_TAGS = new Set(["P", "BR", "B", "STRONG", "I", "EM", "U", "S", "UL", "OL", "LI", "A", "H1", "H2", "H3", "H4", "BLOCKQUOTE", "CODE", "PRE", "SPAN", "DIV", "IMG", "HR", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD"]);

export const safeHtml = (html) => {
      const doc = new DOMParser().parseFromString(`<body>${html || ""}</body>`, "text/html");
      const walk = (node) => {
            [...node.children].forEach((el) => {
                  if (!ALLOWED_TAGS.has(el.tagName)) { el.replaceWith(...el.childNodes); return; }
                  [...el.attributes].forEach((a) => {
                        const n = a.name.toLowerCase();
                        const ok = (el.tagName === "A" && n === "href" && /^(https?:|mailto:)/i.test(a.value))
                              || (el.tagName === "IMG" && n === "src" && /^(https?:|data:image\/)/i.test(a.value))
                              || (el.tagName === "IMG" && n === "alt")
                              || (n === "style" && /^[\w\s:;#%.,()-]*$/.test(a.value) && !/url\(|expression|javascript/i.test(a.value))
                              || ((el.tagName === "TD" || el.tagName === "TH") && (n === "colspan" || n === "rowspan"));
                        if (!ok) el.removeAttribute(a.name);
                  });
                  if (el.tagName === "A") { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener noreferrer"); }
                  walk(el);
            });
      };
      walk(doc.body);
      return doc.body.innerHTML;
};

export default safeHtml;
