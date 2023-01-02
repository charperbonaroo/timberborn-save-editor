import { useState } from 'react';
import './App.css';
import { DemoSave } from './DemoSave';
import { LoadSaveCard } from './LoadSaveCard';
import { Navbar } from './Navbar';
import { SaveContext } from './SaveContext';
import { SaveEditor } from './SaveEditor';

function App() {
  const [saveData, setSaveData] = useState<DemoSave | null>(null);

  return <>
    { saveData === null
    ? <>
    <Navbar onHome={ () => { /* do nothing */ } } />
      < LoadSaveCard onSaveLoaded = { setSaveData } />
        </>
      : <SaveContext.Provider value={ { saveData } }>
    <SaveEditor saveData={ saveData } onSubmit = { setSaveData } />
      </SaveContext.Provider>}
      </>;
}

export default App;
