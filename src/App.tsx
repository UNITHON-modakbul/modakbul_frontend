import { useState } from 'react'
import { Outlet } from 'react-router'
import { TeamNameGate } from './features/team/components/TeamNameGate.tsx'
import type { WorkspaceContext } from './routes/workspaceContext.ts'

function App() {
  const [teamName, setTeamName] = useState<string | null>(null)

  if (!teamName) {
    return <TeamNameGate onContinue={setTeamName} />
  }

  return <Outlet context={{ teamName } satisfies WorkspaceContext} />
}

export default App
