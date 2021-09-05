import { DemoSave } from "./DemoSave";

export function Navbar({ saveData, onHome }: { saveData?: DemoSave, onHome: () => void }) {
  return <nav className="navbar navbar-light bg-light">
    <div className="container">
    {// eslint-disable-next-line
    }<a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} className="navbar-brand">Timberborn Save Editor</a>
    </div>
  </nav>
}
