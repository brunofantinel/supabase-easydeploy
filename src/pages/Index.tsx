import { useState } from 'react';
import { supabase, isConfigured, getConfigStatus } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, Database, Shield, Server } from 'lucide-react';

const Index = () => {
  const [testResult, setTestResult] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const config = getConfigStatus();
  const configured = isConfigured();

  const handleTestConnection = async () => {
    if (!supabase) {
      setTestResult('error');
      setErrorMessage('Cliente Supabase não inicializado. Verifique as variáveis de ambiente.');
      return;
    }

    setTestResult('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult('error');
        setErrorMessage(error.message);
      } else {
        setTestResult('success');
      }
    } catch (err) {
      setTestResult('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Status do Supabase</CardTitle>
          <CardDescription>
            Verificação de conexão com o backend
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Configuração
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">URL</span>
                </div>
                <div className="flex items-center gap-2">
                  {config.hasUrl ? (
                    <>
                      <span className="text-xs text-muted-foreground font-mono">
                        {config.urlPreview}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-destructive">Não configurado</span>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Anon Key</span>
                </div>
                <div className="flex items-center gap-2">
                  {config.hasKey ? (
                    <>
                      <span className="text-xs text-muted-foreground font-mono">
                        {config.keyPreview}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-destructive">Não configurado</span>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Teste de Conexão
            </h3>
            
            <Button 
              onClick={handleTestConnection}
              disabled={!configured || testResult === 'loading'}
              className="w-full"
              size="lg"
            >
              {testResult === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Testar Conexão Supabase
                </>
              )}
            </Button>

            {/* Result Message */}
            {testResult === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent text-accent-foreground">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium">Conectado com sucesso!</span>
              </div>
            )}

            {testResult === 'error' && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Erro na conexão</span>
                </div>
                {errorMessage && (
                  <p className="mt-1 text-sm opacity-80">{errorMessage}</p>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          {!configured && (
            <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Configure as variáveis <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code> e{' '}
                <code className="bg-muted px-1 rounded">VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
                <code className="bg-muted px-1 rounded">.env.local</code> (dev) ou no Easypanel (prod).
              </p>
            </div>
          )}

          {/* Environment Info */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Ambiente: <span className="font-mono">{import.meta.env.DEV ? 'Desenvolvimento' : 'Produção'}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
