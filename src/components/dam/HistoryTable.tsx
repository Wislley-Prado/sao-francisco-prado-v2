
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

  return (
    <div className="mt-8">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Histórico Recente
      </h4>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Afluência</TableHead>
              <TableHead>Defluência</TableHead>
              <TableHead>Cota Final</TableHead>
              <TableHead>Vol. Útil Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historicoDias.slice(0, 5).map((dia, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatDate(dia.dia)}
                </TableCell>
                <TableCell>{dia.vazao_afl} m³/s</TableCell>
                <TableCell>{dia.vazao_def} m³/s</TableCell>
                <TableCell>{dia.cota_final} m</TableCell>
                <TableCell>{dia.vol_util_final}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
