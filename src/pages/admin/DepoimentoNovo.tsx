import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepoimentoForm } from "@/components/admin/depoimento/DepoimentoForm";

export default function DepoimentoNovo() {
  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Novo Depoimento</CardTitle>
          <CardDescription>
            Adicione um novo depoimento de cliente ao seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepoimentoForm />
        </CardContent>
      </Card>
    </div>
  );
}
