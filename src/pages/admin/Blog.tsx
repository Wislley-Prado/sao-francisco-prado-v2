import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const AdminBlog = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os posts do blog e artigos publicados
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Posts</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os artigos do blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Em desenvolvimento</p>
            <p className="text-sm">
              A listagem e gerenciamento do blog será implementada na Fase 6
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
