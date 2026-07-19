
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { DamHistoryDay } from '@/types/damData';
import { formatDate } from '@/utils/damStatus';

interface HistoryTableProps {
  historicoDias: DamHistoryDay[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ historicoDias }) => {
  if (!historicoDias || historicoDias.length === 0) {
    return null;
  }

  const displayRows = [...historicoDias]
    .sort((a, b) => (a.dia < b.dia ? 1 : a.dia > b.dia ? -1 : 0))
    .slice(0, 7);

  return (
    <div className="mt-8">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Histórico Recente
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
                  {formatDate(dia.dia)}
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
