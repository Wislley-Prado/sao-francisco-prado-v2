
export interface DamHistoryDay {
  dia: string;
  vazao_afl: string;
  cota_inicial: string;
  vol_util_inicial: string;
  vazao_def: string;
  cota_final: string;
  vol_util_final: string;
}

export interface DamData {
  nivel_atual: string;
  volume_util_percentual: string;
  afluencia: string;
  defluencia: string;
  historico_dias: DamHistoryDay[];
}

export interface StatusInfo {
  status: string;
  text: string;
  color: string;
}

export interface Condition {
  label: string;
  value: string;
  status: string;
  icon: React.ReactNode;
  trend: string;
}
