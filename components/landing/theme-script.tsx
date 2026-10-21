const SCRIPT = `(function(){var e=document.currentScript.parentElement,m=matchMedia("(prefers-color-scheme: dark)");function a(){var t=null;try{t=localStorage.getItem("theme")}catch(x){}var d=t==="dark"||(t!=="light"&&m.matches);if(d)e.setAttribute("data-theme","dark");else e.removeAttribute("data-theme")}a();m.addEventListener("change",a)})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
