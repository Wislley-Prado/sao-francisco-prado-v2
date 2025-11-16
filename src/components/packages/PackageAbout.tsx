import { Card, CardContent } from '@/components/ui/card';

interface PackageAboutProps {
  description: string;
  highlights?: string[];
}

export const PackageAbout = ({ description, highlights }: PackageAboutProps) => {
  return (
    <section className="py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Sobre este pacote
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {highlights && highlights.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Destaques da experiência
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
