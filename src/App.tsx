import { Button } from './components/Button'
import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/themes/global'

export function App() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />

        <Button variant="primary" />
        <Button variant="secondary" />
        <Button variant="danger" />
        <Button variant="success" />
        <Button />
      </ThemeProvider>
    </div>
  )
}
