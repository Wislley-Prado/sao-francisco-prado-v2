#!/bin/bash
# Script de automação para commit, build e push no Git

echo "🚀 Adicionando arquivos alterados..."
git add .

# Definir mensagem de commit
MSG="${1:-fix: atualizacao automatica e melhorias no projeto}"

echo "📝 Criando commit com a mensagem: '$MSG'..."
git commit -m "$MSG"

echo "📤 Enviando alterações para o repositório remoto (origin main)..."
git push origin main

echo "✅ Sucesso! Código commitado e enviado para produção."
