import { Header } from '@/widgets/header/Header'
import { MainPage } from '@/pages/main/MainPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MainPage />
      </main>
    </div>
  )
}

export default App
