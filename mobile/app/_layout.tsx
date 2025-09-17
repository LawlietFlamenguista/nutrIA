import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebaseConfig'; 


function AuthManager({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

      } else {

        signInAnonymously(auth).catch((error) => {
          console.error("Erro no login anônimo:", error);

        });
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return null;
  }

  return <>{children}</>;
}


export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthManager>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="step/index" />
          <Stack.Screen name="create/index" />
          <Stack.Screen name="nutrition/index" />
          <Stack.Screen name="plano/plano" />
          <Stack.Screen name="leitor" />
          <Stack.Screen name="produto" />
          <Stack.Screen name="telasiniciais/splash" />
          <Stack.Screen name="telasiniciais/bemvindo" />
          <Stack.Screen name="telasiniciais/cadastro" />
          <Stack.Screen name="telasiniciais/login" />
          <Stack.Screen name="telasiniciais/esq_senha" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="telasperfil/editar" />
          <Stack.Screen name="telasperfil/conquistas" />
          <Stack.Screen name="telasperfil/config" />
          <Stack.Screen name="telasperfil/notificacao" />
          <Stack.Screen name="telasperfil/privacidade" />
          <Stack.Screen name="telasperfil/assinatura" />
        </Stack>
      </AuthManager>
    </QueryClientProvider>
  );
}