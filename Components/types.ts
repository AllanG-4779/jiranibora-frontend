export interface userData {
  memberId: string;
  password: string;
}

export interface credentialProperties {
  validity: boolean;
  message: string;
}
export type application = {
  name: string;
  position: string;
  dob: string;
  phone: string;
  age: number;
  amount: number;
  email: string;
  ID: string;
  status: string;
};
export type db_application = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  amount: string;
  nationalId: string;
  residential: string;
  dob: string;
  status: string;
  reasonIfDeclined: string;
  viewed: boolean;
  actedUponAt: string;
  createdAt: string;
  id: number;
  applicationRef: string;
};
export type sessionType = {
  user: {
    role: string;
    access_token: string;
    fullName: string;
    phone: string;
    monthlyCont: string;
    memberId: string;
  };
  expires: string;
};
export type backendJWT = {
  member_id: string;
  name: string;
  sub: string;
  iat: number;
  exp: number;
};
export type loanApplication = {
  amount: number;
  duration: number;
  owner: string;
  fullname?: string;
  nationalId?: string;
};

export type loanApplicationDetail = {
  amount: number;
  duration: number;
  fullName: string;
  owner: string;
  memberId: string;
  loanId: string;
  contribution: number;
};
export type clientData = {
  accountHolder: string;
  accountSummary: {
    contributions: any;
    loanAndInterest: any;
    fineAndPenalties: any;
  };
  penalties: {
    penaltyCode: string;
    meetMonth: string;
    amount: number;
    status: string;
    dateAdded: string;
  }[];
  fines: {
    fineCode: string;
    category: string;
    amount: number;
    meetingId: string;
    dateAdded: string;
    paid: boolean;
  }[];
};
export type contribution = {
  contId: string;
  month: string;
  status: string;
  openOn: string;
  closeOn: string;
};
export type membercontribution = {
  month: string;
  contributionId: string;
  status: string;
  penalty: number;
  date: string;
};
export type allLoans = {
  loanId: string;
  dateApplied: string;
  dateApproved: string;
  amount: number;
  member:string;
  memberId:string
  initialDuration: number;
  initialInterest: number;
  extraInterest: number;
  outstandingAmount: number;

  status: string;
}[];
export type loanDataType = {
  loanSummary: {
    allTimeBorrowing: number;
    allTimeInterest: number;
    declined: number;
  };
  loanResponseList: allLoans;
};
export type transactionType = {
  transactionId: string;
  transactioncategory: string;
  transactionDate: string;
  transactionAmount: number;
};
export type meeting = {
  meetingId: string;
  meetingDate: string;
  status: string;
  month: string;
};
export type memberToFineType = {
  existingFine: number;
  meetingId: string;
  memberId: string;
  memberName: string;
};
export type pendingFineType = {
  amount: number;
  dateFined: string;
  fine: string;
  meetingId: string;
  memberId: string;
  name: string;
  phone: string;
};
export type secHomePage = {
  latestFines: pendingFineType[];
  totalFinesCollected: number;
  totalMeetings: number;
  totalPendingFines: number;
  meetinglyFine: { month: string; total: number }[];
};
export type treasurerHomePageType = {
  amountLoaned: number;
  amountPaid: number;
  earningFromPenalties: number;
  interestEarned: number;
  totalContributions: number;
  numberOfLoansGiven: number;
  numberOfLoansOutstanding: number;
  pendingLoans: {
    name: string;
    memberId: string;
    amount: number;
    interest: number;
    dueDate: string;
  }[];
};
export type activeContribution = {
  contId: string;
  monthCount: number;
  month: string;
  status: string;
  openOn: string;
  closeOn: string;
  contMonths: string;
};
export type contributionSummary = {
  contributionId: string;
  lockedMembers: number;
  amountCollected: number;
  expectedPenalties: number;
  openDate: string;
  closeDate: string;
}[];
export type memberEarning = {
  memberId: string;
  totalContribution: number;
  loans: number;
  fines: number;
  penalties: number;
  netShares: number;
  name: number;
  interestEarned: number;
  finalPayout: number;
  netContribution: number;
}[];
export type performanceDto = {
  activeMembers: number;
  dormantMembers: number;
  memberDeposits: number;
  loanToMembers: number;
  repaidLoans: number;
  interestEarned: number;
  finesIssued: number;
  totalPenalties: number;
  paidPenalties: number;
  finesPaid: number;
  membersWithAbsoluteNoEarning: number;
  sharableIncome: number;
  totalCollection: number;
};
export type performanceData = {
  sender: string;
  members: {
    active: number;
    dormant: number;
  };
  data: {
    description: string;
    value: number;
  }[];
};
export type users = {
  memberId: string;
  fullName: string;
  role: string;
  status: boolean;
}[];
