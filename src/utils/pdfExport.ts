import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvaliacaoData {
  id: string;
  nota: number;
  comentario: string;
  created_at: string;
  ranchos?: {
    nome: string;
  };
}

interface EstatisticasRancho {
  rancho: string;
  total: number;
  media: string;
}

export const exportarRelatorioAvaliacoes = (
  avaliacoes: AvaliacaoData[],
  estatisticasPorRancho: EstatisticasRancho[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Relatório de Avaliações', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );

  yPosition += 15;

  // Estatísticas Gerais
  const totalAvaliacoes = avaliacoes?.length || 0;
  const mediaGeral = avaliacoes?.length
    ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
    : '0.0';
  const avaliacoesPositivas = avaliacoes?.filter(av => av.nota >= 4).length || 0;
  const taxaPositiva = totalAvaliacoes > 0 
    ? ((avaliacoesPositivas / totalAvaliacoes) * 100).toFixed(1) 
    : '0';

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Resumo Geral', 15, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const resumoData = [
    ['Total de Avaliações', `${totalAvaliacoes}`],
    ['Média Geral', `${mediaGeral} ⭐`],
    ['Taxa de Satisfação', `${taxaPositiva}% (4+ estrelas)`],
    ['Ranchos Avaliados', `${estatisticasPorRancho.length}`]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Métrica', 'Valor']],
    body: resumoData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    }
  });

  // Nova página para estatísticas por rancho
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Estatísticas por Rancho', 15, yPosition);
  yPosition += 8;

  const ranchosData = estatisticasPorRancho
    .sort((a, b) => Number(b.media) - Number(a.media))
    .map((stat, index) => [
      `${index + 1}`,
      stat.rancho,
      `${stat.total}`,
      `${stat.media} ⭐`,
      '⭐'.repeat(Math.round(Number(stat.media)))
    ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['#', 'Rancho', 'Total', 'Média', 'Avaliação']],
    body: ranchosData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 'auto', halign: 'center' }
    }
  });

  // Distribuição de Notas
  const distribuicaoNotas = [1, 2, 3, 4, 5].map(nota => ({
    nota: `${nota} ⭐`,
    quantidade: avaliacoes?.filter(av => av.nota === nota).length || 0,
    percentual: totalAvaliacoes > 0 
      ? ((avaliacoes?.filter(av => av.nota === nota).length || 0) / totalAvaliacoes * 100).toFixed(1)
      : '0'
  }));

  doc.addPage();
  yPosition = 20;

  doc.setFontSize(14);
  doc.text('Distribuição de Notas', 15, yPosition);
  yPosition += 8;

  const distribuicaoData = distribuicaoNotas.map(d => [
    d.nota,
    `${d.quantidade}`,
    `${d.percentual}%`
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Nota', 'Quantidade', 'Percentual']],
    body: distribuicaoData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 50, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 50, halign: 'center' },
      2: { cellWidth: 'auto', halign: 'center' }
    }
  });

  // Avaliações Recentes (últimas 10)
  const avaliacoesRecentes = avaliacoes?.slice(0, 10) || [];
  
  if (avaliacoesRecentes.length > 0) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.text('Avaliações Recentes (Últimas 10)', 15, yPosition);
    yPosition += 8;

    const avaliacoesData = avaliacoesRecentes.map(av => [
      av.ranchos?.nome || 'N/A',
      `${av.nota} ⭐`,
      av.comentario.substring(0, 80) + (av.comentario.length > 80 ? '...' : ''),
      format(new Date(av.created_at), 'dd/MM/yyyy', { locale: ptBR })
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Rancho', 'Nota', 'Comentário', 'Data']],
      body: avaliacoesData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 95 },
        3: { cellWidth: 25, halign: 'center' }
      }
    });
  }

  // Rodapé em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Rancho Prado - Sistema de Gerenciamento',
      15,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Salvar o PDF
  const fileName = `relatorio-avaliacoes-${format(new Date(), 'dd-MM-yyyy-HHmm')}.pdf`;
  doc.save(fileName);
};
