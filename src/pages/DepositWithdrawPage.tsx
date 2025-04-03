
import Layout from "@/components/Layout";
import MoneyTransactionForm from "@/components/Forms/MoneyTransactionForm";

const DepositWithdrawPage = () => {
  return (
    <Layout title="Depósito e Saque">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Depósito e Saque</h1>
        <p className="text-muted-foreground">
          Adicione ou retire fundos da sua conta
        </p>
      </div>
      
      <MoneyTransactionForm />
    </Layout>
  );
};

export default DepositWithdrawPage;
