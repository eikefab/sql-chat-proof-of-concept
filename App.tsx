import { AuthContextProvider } from './src/context/use-auth';
import Router from './src/router';

export default function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  )
}