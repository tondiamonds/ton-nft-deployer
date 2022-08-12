import React from 'react'
import styled from 'styled-components'

const LogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 100%;
  border: 1px solid var(--color-accent);
  margin: 0.5rem 0;
  overflow-y: scroll;
`

export function Logs({ logs }: { logs: string[] }) {
  return (
    <div>
      Logs:
      <LogsContainer>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </LogsContainer>
    </div>
  )
}
