
import Layout from "@/components/Layout";
import CreateWalletForm from "@/components/Forms/CreateWalletForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CreateWalletPage = () => {
  return (
    <Layout title="Nova Carteira">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/carteiras">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para carteiras
        </Link>
      </Button>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Nova Carteira</h1>
        <p className="text-muted-foreground">
          Crie uma nova carteira para gerenciar seus ativos
        </p>
      </div>
      
      <CreateWalletForm />
    </Layout>
  );
};

export default CreateWalletPage;
