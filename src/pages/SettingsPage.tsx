
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BellRing, Lock, User, Globe, Moon, Sun, CreditCard, Shield, BellOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso",
      });
    }, 1000);
  };
  
  return (
    <Layout title="Configurações">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
        
        <Tabs defaultValue="perfil" className="space-y-4">
          <div className="bg-card rounded-lg p-1 mb-6">
            <TabsList className="grid grid-cols-4 sm:grid-cols-4 w-full">
              <TabsTrigger value="perfil">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="seguranca">
                <Lock className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="notificacoes">
                <BellRing className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="preferencias">
                <Globe className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Preferências</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="perfil" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue="Usuário Demo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="demo@exemplo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <textarea
                    id="bio"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="seguranca" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba códigos de verificação por SMS
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação por App</Label>
                      <p className="text-sm text-muted-foreground">
                        Use um aplicativo autenticador
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta, exigindo mais do que apenas uma senha para fazer login.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notificacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Escolha como deseja ser notificado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alterações de preço</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas quando houver mudanças significativas no preço
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novidades do mercado</Label>
                      <p className="text-sm text-muted-foreground">
                        Fique por dentro das últimas notícias do mercado
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatórios semanais</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo semanal da sua carteira
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Habilitar notificações por email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <BellOff className="h-4 w-4" />
                  Desativar Todas
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Interface</CardTitle>
                <CardDescription>
                  Personalize sua experiência na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre o tema claro ou escuro
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon" className="h-8 w-8">
                      <Moon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Moeda de exibição</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>BRL</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>USD</span>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>EUR</span>
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Método de pagamento padrão</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Cartão de Crédito</p>
                        <p className="text-xs text-muted-foreground">Visa terminando em 4242</p>
                      </div>
                    </div>
                    <Button variant="outline" className="flex justify-center items-center h-14">
                      <span>Adicionar método</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
