
import Layout from "@/components/Layout";
import AddAssetForm from "@/components/Forms/AddAssetForm";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AddAssetPage = () => {
  const { walletId } = useParams<{ walletId: string }>();
  
  return (
    <Layout title="Adicionar Ativo">
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/carteiras/${walletId}`}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para detalhes da carteira
        </Link>
      </Button>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Adicionar Ativo</h1>
        <p className="text-muted-foreground">
          Adicione um novo ativo à sua carteira
        </p>
      </div>
      
      <AddAssetForm />
    </Layout>
  );
};

export default AddAssetPage;
