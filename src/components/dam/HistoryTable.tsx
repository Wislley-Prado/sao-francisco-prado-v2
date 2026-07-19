import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { DamHistoryDay } from '@/types/damData';
import { formatDate } from '@/utils/damStatus';

interface HistoryTableProps {
  historicoDias: DamHistoryDay[];
}

const parseDateToTimestamp = (dateStr: string): number => {
  if (!dateStr) return 0;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      if (parts[0] > 1900) return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }
  }
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      if (parts[2] > 1900) return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
      return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    }
  }
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ historicoDias }) => {
  if (!historicoDias || historicoDias.length === 0) {
    return null;
  }

  // Ordenar do dia mais recente para o mais antigo (decrescente)
  const displayRows = [...historicoDias]
    .sort((a, b) => parseDateToTimestamp(b.dia || b.data_original) - parseDateToTimestamp(a.dia || a.data_original))
    .slice(0, 9);

  return (
    <div className="mt-8">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Histórico Recente (Últimos {displayRows.length} Dias)
      </h4>
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <Table className="min-w-[480px] sm:min-w-full text-xs sm:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 sm:py-3">Data</TableHead>
              <TableHead className="py-2 sm:py-3">Afluência</TableHead>
              <TableHead className="py-2 sm:py-3">Defluência</TableHead>
              <TableHead className="py-2 sm:py-3">Cota Final</TableHead>
              <TableHead className="py-2 sm:py-3">Vol. Útil Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((dia, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium py-2 sm:py-3">
                  {dia.data_original || formatDate(dia.dia)}
                </TableCell>
                <TableCell className="py-2 sm:py-3">{dia.vazao_afl} m³/s</TableCell>
                <TableCell className="py-2 sm:py-3">{dia.vazao_def} m³/s</TableCell>
                <TableCell className="py-2 sm:py-3">{dia.cota_final} m</TableCell>
                <TableCell className="py-2 sm:py-3 font-semibold text-blue-600">{dia.vol_util_final}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
