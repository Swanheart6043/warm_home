interface HomeData {
  nickname: string;
  totalAccounts: number;
  totalTasks: number;
  totalDevices: number;
}

interface HomeCharts {
  date?: string;
  value?: number;
  type?: string;
}

interface HomeTemp {
  totalIncome?: number;
  todayIncome?: number;
  totalNumberOfAccounts?: number;
  windowNumber?: number;
  numberOfPrimaryAccounts?: number;
  numberOfPrimaryAccountServers?: number;
  numberOfSecondaryAccounts?: number;
  numberOfSecondaryAccountServers?: number;

  showcaseAccounts?: number;
  mainAccounts?: number;
  mainServers?: number;
  secondaryAccounts?: number;
  secondaryServers?: number;
  monthlyEarnings?: number;
  totalEarnings?: number;
}
