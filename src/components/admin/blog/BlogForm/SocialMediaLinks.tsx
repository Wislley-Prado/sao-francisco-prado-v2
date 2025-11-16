import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface SocialMediaLinksProps {
  value: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  onChange: (value: any) => void;
}

export const SocialMediaLinks = ({ value, onChange }: SocialMediaLinksProps) => {
  const handleChange = (platform: string, url: string) => {
    onChange({
      ...value,
      [platform]: url || undefined,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </Label>
        <Input
          type="url"
          placeholder="https://facebook.com/..."
          value={value?.facebook || ''}
          onChange={(e) => handleChange('facebook', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Instagram className="h-4 w-4 text-pink-600" />
          Instagram
        </Label>
        <Input
          type="url"
          placeholder="https://instagram.com/..."
          value={value?.instagram || ''}
          onChange={(e) => handleChange('instagram', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Twitter className="h-4 w-4 text-blue-400" />
          Twitter/X
        </Label>
        <Input
          type="url"
          placeholder="https://twitter.com/..."
          value={value?.twitter || ''}
          onChange={(e) => handleChange('twitter', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-blue-700" />
          LinkedIn
        </Label>
        <Input
          type="url"
          placeholder="https://linkedin.com/..."
          value={value?.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
        />
      </div>
    </div>
  );
};
