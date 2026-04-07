import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUploader } from "@/components/admin/depoimento/ImageUploader";

interface AdminProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminProfileDialog({ open, onOpenChange }: AdminProfileDialogProps) {
  const { user, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load current values
  useEffect(() => {
    if (user?.user_metadata) {
      setFullName(user.user_metadata.full_name || "");
      setAvatarUrl(user.user_metadata.avatar_url || "");
    }
  }, [user, open]);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile(fullName, avatarUrl);
    setIsSaving(false);
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Meu Perfil</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="avatar" className="text-left font-medium">
              Foto de Perfil
            </Label>
            <ImageUploader 
              value={avatarUrl} 
              onChange={setAvatarUrl} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Dica: Envie uma imagem quadrada (ex: 400x400 px), ela será recortada e mostrada em formato redondo.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Label htmlFor="name" className="text-left font-medium">
              Nome de Exibição
            </Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Seu Nome"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
