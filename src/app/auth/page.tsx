// app/auth/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

export default function AuthenticationPage() {
  const [view, setView] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // --- NOVO ESTADO PARA O NOME DE EXIBIÇÃO ---
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // --- LÓGICA ATUALIZADA PARA INCLUIR O NOME ---
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName, // É assim que salvamos metadados no Supabase
        },
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Cadastro realizado! Verifique seu e-mail para o link de confirmação.",
      });
      setView("login");
    }
    setLoading(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: "E-mail ou senha inválidos." });
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  const toggleView = () => {
    setView(view === "login" ? "signup" : "login");
    setMessage(null);
  };

  return (
    <div className="from-background via-background to-muted/30 flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-gradient-to-br px-4">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <p className="text-center text-6xl italic">
        CBGF<br></br>Contábil
      </p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {view === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
          </CardTitle>
          <CardDescription>
            {view === "login"
              ? "Digite seu e-mail e senha para acessar o sistema."
              : "Preencha os campos abaixo para se cadastrar."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={view === "login" ? handleLogin : handleSignUp}>
          <CardContent className="grid gap-4">
            {/* --- NOVO CAMPO DE NOME (APENAS PARA CADASTRO) --- */}
            {view === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="displayName">Nome de Exibição</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu Nome Completo"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4 flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {view === "login" ? "Entrar" : "Cadastrar"}
            </Button>
            {message && (
              <div
                className={`flex w-full items-center gap-2 rounded-md p-3 text-sm ${
                  message.type === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-700"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <p>{message.text}</p>
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              {view === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
              <Button
                variant="link"
                type="button"
                onClick={toggleView}
                className="pl-1"
              >
                {view === "login" ? "Cadastre-se" : "Entrar"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
