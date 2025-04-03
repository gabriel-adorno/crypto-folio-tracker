
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  return (
    <Layout title="Configurações">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize as configurações da sua aplicação
        </p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure as preferências de notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Notificações por email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações importantes por email
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price-alerts" className="font-medium">
                  Alertas de preço
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando os preços atingirem limites definidos
                </p>
              </div>
              <Switch id="price-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="news-updates" className="font-medium">
                  Atualizações e notícias
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba novidades sobre criptomoedas e atualizações da plataforma
                </p>
              </div>
              <Switch id="news-updates" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Customize sua experiência na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">
                  Modo escuro
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ative o modo escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-refresh" className="font-medium">
                  Atualização automática
                </Label>
                <p className="text-sm text-muted-foreground">
                  Atualize automaticamente os preços e dados da carteira
                </p>
              </div>
              <Switch id="auto-refresh" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animation" className="font-medium">
                  Animações
                </Label>
                <p className="text-sm text-muted-foreground">
                  Habilitar animações na interface
                </p>
              </div>
              <Switch id="animation" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Gerencie sua conta e preferências de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Informações pessoais</h3>
                <p className="text-sm text-muted-foreground">
                  Atualize suas informações pessoais
                </p>
              </div>
              <Button variant="outline">Editar</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Altere sua senha ou configure autenticação de dois fatores
                </p>
              </div>
              <Button variant="outline">Gerenciar</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-destructive">Excluir conta</h3>
                <p className="text-sm text-muted-foreground">
                  Exclua permanentemente sua conta e dados
                </p>
              </div>
              <Button variant="destructive">Excluir</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
