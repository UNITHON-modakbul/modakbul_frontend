import { useState } from 'react'
import { ProjectStartPage } from './features/project/pages/ProjectStartPage.tsx'
import { TeamNameGate } from './features/team/components/TeamNameGate.tsx'

function App() {
  const [teamName, setTeamName] = useState<string | null>(null)

  if (!teamName) {
    return <TeamNameGate onContinue={setTeamName} />
  }

  return <ProjectStartPage teamName={teamName} />
}

export default App
