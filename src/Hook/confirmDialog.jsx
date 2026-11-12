import { createRoot } from "react-dom/client";
import { ConfirmView } from "./ConfirmView";

// The site's own confirmation dialog (replaces the browser's confirm() and the stock SweetAlert boxes).
//
//   if (await confirmDialog({ title: "Delete this task?", message: "This cannot be undone.", confirmText: "Delete", tone: "danger" })) { ... }
//   const reason = await promptDialog({ title: "Reject this leave?", label: "Reason", required: true, confirmText: "Reject", tone: "danger" });  // string, or null when cancelled
//
// tone: "danger" (red, focus starts on Cancel) | "warning" (amber) | "default" (brand blue).
// It matches the page it opens on: dark in the dark dashboard, light in light mode and on the public site.

// Light on the public site and in the light dashboard, dark otherwise.
const wantsDark = () => !document.querySelector(".dash-light, .public-site");

let active = null; // one dialog at a time

const open = (props) => new Promise((resolve) => {
      active?.();
      const host = document.createElement("div");
      document.body.appendChild(host);
      const root = createRoot(host);
      const previous = document.activeElement;
      let done = false;
      const close = (result) => {
            if (done) return;
            done = true;
            active = null;
            root.unmount();
            host.remove();
            if (previous && typeof previous.focus === "function") previous.focus();
            resolve(result);
      };
      active = () => close(props.prompt ? null : false);
      root.render(<ConfirmView {...props} dark={wantsDark()} onConfirm={(v) => close(v)} onCancel={() => close(props.prompt ? null : false)} />);
});

export const confirmDialog = (opts) => open(opts);
export const promptDialog = ({ label, placeholder, required = true, requiredMessage, defaultValue, maxLength, ...rest }) => open({ ...rest, prompt: { label, placeholder, required, requiredMessage, defaultValue, maxLength } });

export default confirmDialog;
