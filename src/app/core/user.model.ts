export interface Roles {
    user?: boolean,
    screener?: boolean,
    judge?: boolean,
    admin?: boolean,
    superjudge?:boolean
}

export interface Members {
    name: string;
    role: string;
    experience: string;
    linkedInProfile: string;
}

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    teamName?: string;
    teamSize?: number;
    country?: string;
    phone?: string;
    type?: string;
    name: string;
    roles: Roles;
    dob: Date;
    city: string;
}

export interface BasicSubmission {
    teamName: string;
    userId: string;
    category: string;
    stage: string;
    pitch: string;
    overview: string;
    potential: string;
    market: string;
    competition: string;
    teamSize: string;
    members: Members[];
    revenue?: number;
    year?: number;
    website?: string;
    partner?: string;
    attachment?: string;
    preScreen: preScreen;
    judgeEntries: JudgeEntry[];
}

export interface AuthData {
    email: string;
    password: string;
}

export interface EntryTableData {
    teamName: string;
    category: string;
    stage: string;
    status: string;
    submissionId: string;
    numericId: string;
    entries: any[];
}

export interface StatsData {
    submissionId: string;
    category: string;
    teamName: string;
    stage: string;
    attachment: string;
    userID: string;
}

export interface StatsCount {
    totCount: number;
    catCountPharmaceutical: number;
    catCountMedical: number;
    catCountDevices: number;
    catCountHospital: number;
    catCountServices: number;
    catCountDigital: number;
    catCountDiagnostics: number;
    catCountOthers: number;
    catCountUndef: number;
    stgCountIdeation: number;
    stgCountPOC: number;
    stgCountRevenues: number;
    stgCountUndef: number;
}

export interface UserTableData{
    name: string;
    roles: any;
    email: string;
    uid: string;
    phone: string;
}

export interface Criteria {
    criteriaName: string;
    criteriaScore: number;
    criteriaCategory: string;
}

export interface JudgeEntry {
    revenuePotential: number;
    implementability: number;
    synergy: number;
    uniqueness: number;
    judgeUID: string;
    judgeName: string;
    comments: string;
    score: number;
}

export interface preScreen{
    health: string;
    revenue: string;
}

