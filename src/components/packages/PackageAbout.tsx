import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface PackageAboutProps {
  description: string;
  highlights?: string[];
}

export const PackageAbout = ({ description, highlights }: PackageAboutProps) => {
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <Card className="border-2 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Sobre este pacote
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {highlights && highlights.length > 0 && (
              <div className="mt-10 pt-10 border-t-2 border-border">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  ✨ Destaques da experiência
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
                      <span className="text-primary text-xl font-bold mt-0.5">✓</span>
                      <span className="text-foreground font-medium">{highlight}</span>
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
