
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Crypto Manager</CardTitle>
          <CardDescription>
            Gerencie suas carteiras de criptomoedas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Bem-vindo ao seu gerenciador de carteiras de criptomoedas. 
            Acompanhe seus investimentos, monitore o desempenho e gerencie múltiplas carteiras.
          </p>
          <div className="flex justify-center pt-4">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Acessar Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
