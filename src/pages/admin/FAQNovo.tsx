import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQForm } from "@/components/admin/faq/FAQForm";

export default function FAQNovo() {
  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Nova FAQ</CardTitle>
          <CardDescription>
            Adicione uma nova pergunta frequente ao seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQForm />
        </CardContent>
      </Card>
    </div>
  );
}
