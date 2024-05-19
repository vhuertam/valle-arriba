
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class InputLogin {
    rut: string;
    password: string;
}

export class BinData {
    idBins: string;
}

export class InputCard {
    idCard: string;
    date: Date;
    quadrille: string;
    percentageVolume: number;
    harvestType: string;
    contractor: string;
    condition: string;
    estimatedWeight: number;
    idBins: string;
    idUserRegister: string;
    idVariety: string;
    idQuarter: string;
}

export class InputCleaningLine {
    idCleaningLine: string;
    date: Date;
    idUser: string;
}

export class InputCleaningLineEdit {
    idCleaningLine: string;
    date: Date;
}

export class InputCleaningStoragePond {
    idCleaningStoragePond: string;
    date: Date;
    idStoragePond?: string;
    idUser: string;
}

export class InputCleaningStoragePondEdit {
    idCleaningStoragePond: string;
    date: Date;
}

export class EstateData {
    idEstate: string;
    name: string;
}

export class InputMacrozone {
    idMacrozone: string;
    name: string;
    idEstate: string;
}

export class InputMacrozoneEdit {
    idMacrozone: string;
    name: string;
    idEstate?: string;
}

export class InputPelequenGuide {
    idPelequenGuide: string;
    document: string;
    name?: string;
    idUser: string;
}

export class InputPelequenGuideEdit {
    idPelequenGuide: string;
    document: string;
    name?: string;
}

export class InputPhytosanitaryRegister {
    idPhytosanitaryRegister: string;
    startDate: Date;
    endDate: Date;
    idUser: string;
    idSection: string;
    idProduct?: string;
}

export class InputPhytosanitaryRegisterEdit {
    idPhytosanitaryRegister: string;
    startDate: Date;
    endDate: Date;
    idSection?: string;
    idProduct?: string;
}

export class InputPhytosanitaryRegisterProduct {
    idPhytosanitaryRegister: string;
    idProduct: string;
    idPhytosanitaryRegisterEdit?: string;
    idProductEdit?: string;
}

export class InputProcessBatch {
    idProcessBatch: string;
    date: Date;
    condition: string;
    idUser: string;
    idSaveBatch: string;
}

export class InputProcessBatchEdit {
    idProcessBatch: string;
    date: Date;
    condition: string;
}

export class ProductData {
    idProduct: string;
    name: string;
    days: number;
}

export class InputQuarter {
    idQuarter: string;
    name: string;
    estimatedHarvestKg?: number;
    idSection: string;
}

export class InputQuarterEdit {
    idQuarter: string;
    name: string;
    estimatedHarvestKg?: number;
    idSection?: string;
}

export class RoleData {
    idRole: string;
    name: string;
}

export class InputSaveBatch {
    idSaveBatch: string;
    date: Date;
    totalLiters?: number;
    condition: string;
    idStoragePond: string;
    idUser: string;
    idTransportBatch?: string;
}

export class InputSaveBatchEdit {
    idSaveBatch: string;
    date: Date;
    totalLiters?: number;
    condition: string;
}

export class InputSection {
    idSection: string;
    name: string;
    estimatedHarvestKg?: number;
    idMacrozone: string;
}

export class InputSectionEdit {
    idSection: string;
    name: string;
    estimatedHarvestKg?: number;
    idMacrozone?: string;
}

export class SpecieData {
    idSpecie: string;
    name: string;
}

export class StoragePondData {
    idStoragePond: string;
    capacitance: number;
    currentLiters?: number;
}

export class InputTransportBatch {
    idTransportBatch: string;
    date: Date;
    idPelequenGuide?: string;
    idUser: string;
}

export class InputTransportBatchEdit {
    idTransportBatch: string;
    date: Date;
}

export class UserData {
    rut: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    position: string;
    idRole?: string;
}

export class UserDataEdit {
    rut: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    idRole?: string;
}

export class InputVariety {
    idVariety: string;
    name: string;
    idSpecie: string;
}

export class InputVarietyEdit {
    idVariety: string;
    name: string;
}

export class InputVarietyQuarter {
    idVariety: string;
    idQuarter: string;
    idVarietyEdit?: string;
    idQuarterEdit?: string;
}

export abstract class IMutation {
    abstract login(input?: InputLogin): LoginResponse | Promise<LoginResponse>;

    abstract createBins(input?: BinData): Bin | Promise<Bin>;

    abstract editBins(id?: string, input?: BinData): Bin | Promise<Bin>;

    abstract deleteBins(id?: string): Bin | Promise<Bin>;

    abstract changeBinsAvailable(id?: string): Bin | Promise<Bin>;

    abstract changeBinsNotAvailable(id?: string): Bin | Promise<Bin>;

    abstract createCard(input?: InputCard): Card | Promise<Card>;

    abstract createNCard(cant?: number, input?: InputCard): Card | Promise<Card>;

    abstract editCard(id?: string, input?: InputCard): Card | Promise<Card>;

    abstract toAssignCardToProcessBatch(id?: string[], idProcessBatch?: string): Card[] | Promise<Card[]>;

    abstract toAssignProcessBatchToSaveBatch(idProcessBatch?: string[], idSaveBatch?: string): ProcessBatch[] | Promise<ProcessBatch[]>;

    abstract toAssignSaveBatchToTransportBatch(idSaveBatch?: string[], idTransportBatch?: string): SaveBatch[] | Promise<SaveBatch[]>;

    abstract toAssignWeigthToCard(id?: string, userWeight?: string, grossWeight?: number): Card | Promise<Card>;

    abstract deleteCard(id?: string): Card | Promise<Card>;

    abstract createCleaningLine(input?: InputCleaningLine): CleaningLine | Promise<CleaningLine>;

    abstract editCleaningLine(id?: string, input?: InputCleaningLineEdit): CleaningLine | Promise<CleaningLine>;

    abstract deleteCleaningLine(id?: string): CleaningLine | Promise<CleaningLine>;

    abstract createCleaningStoragePond(input?: InputCleaningStoragePond): CleaningStoragePond | Promise<CleaningStoragePond>;

    abstract editCleaningStoragePond(id?: string, input?: InputCleaningStoragePondEdit): CleaningStoragePond | Promise<CleaningStoragePond>;

    abstract deleteCleaningStoragePond(id?: string): CleaningStoragePond | Promise<CleaningStoragePond>;

    abstract createEstate(input?: EstateData): Estate | Promise<Estate>;

    abstract editEstate(id?: string, input?: EstateData): Estate | Promise<Estate>;

    abstract deleteEstate(id?: string): Estate | Promise<Estate>;

    abstract createMacrozone(input?: InputMacrozone): Macrozone | Promise<Macrozone>;

    abstract editMacrozone(id?: string, input?: InputMacrozoneEdit): Macrozone | Promise<Macrozone>;

    abstract deleteMacrozone(id?: string): Macrozone | Promise<Macrozone>;

    abstract createPelequenGuide(input?: InputPelequenGuide): PelequenGuide | Promise<PelequenGuide>;

    abstract editPelequenGuide(id?: string, input?: InputPelequenGuideEdit): PelequenGuide | Promise<PelequenGuide>;

    abstract deletePelequenGuide(id?: string): PelequenGuide | Promise<PelequenGuide>;

    abstract createPhytosanitaryRegister(input?: InputPhytosanitaryRegister): PhytosanitaryRegister | Promise<PhytosanitaryRegister>;

    abstract editPhytosanitaryRegister(id?: string, input?: InputPhytosanitaryRegisterEdit): PhytosanitaryRegister | Promise<PhytosanitaryRegister>;

    abstract deletePhytosanitaryRegister(id?: string): PhytosanitaryRegister | Promise<PhytosanitaryRegister>;

    abstract createPhytosanitaryRegisterProduct(input?: InputPhytosanitaryRegisterProduct): PhytosanitaryRegisterProduct | Promise<PhytosanitaryRegisterProduct>;

    abstract editPhytosanitaryRegisterProduct(input?: InputPhytosanitaryRegisterProduct): PhytosanitaryRegisterProduct | Promise<PhytosanitaryRegisterProduct>;

    abstract deletePhytosanitaryRegisterProduct(input?: InputPhytosanitaryRegisterProduct): PhytosanitaryRegisterProduct | Promise<PhytosanitaryRegisterProduct>;

    abstract createProcessBatch(input?: InputProcessBatch): ProcessBatch | Promise<ProcessBatch>;

    abstract editProcessBatch(id?: string, input?: InputProcessBatchEdit): ProcessBatch | Promise<ProcessBatch>;

    abstract deleteProcessBatch(id?: string): ProcessBatch | Promise<ProcessBatch>;

    abstract toAssignWeigthToProcessBatch(id?: string, residualWeight?: number): ProcessBatch | Promise<ProcessBatch>;

    abstract toAssignLitersToProcessBatch(id?: string, generatedLiters?: number): ProcessBatch | Promise<ProcessBatch>;

    abstract createProduct(input?: ProductData): Product | Promise<Product>;

    abstract editProduct(id?: string, input?: ProductData): Product | Promise<Product>;

    abstract deleteProduct(id?: string): Product | Promise<Product>;

    abstract createQuarter(input?: InputQuarter): Quarter | Promise<Quarter>;

    abstract editQuarter(id?: string, input?: InputQuarterEdit): Quarter | Promise<Quarter>;

    abstract deleteQuarter(id?: string): Quarter | Promise<Quarter>;

    abstract createRole(input?: RoleData): Role | Promise<Role>;

    abstract editRole(id?: string, input?: RoleData): Role | Promise<Role>;

    abstract deleteRole(id?: string): Role | Promise<Role>;

    abstract createSaveBatch(input?: InputSaveBatch): SaveBatch | Promise<SaveBatch>;

    abstract editSaveBatch(id?: string, input?: InputSaveBatchEdit): SaveBatch | Promise<SaveBatch>;

    abstract deleteSaveBatch(id?: string): SaveBatch | Promise<SaveBatch>;

    abstract toAssignLitersToSaveBatch(id?: string, user?: string, totalLiters?: number): SaveBatch | Promise<SaveBatch>;

    abstract createSection(input?: InputSection): Section | Promise<Section>;

    abstract editSection(id?: string, input?: InputSectionEdit): Section | Promise<Section>;

    abstract deleteSection(id?: string): Section | Promise<Section>;

    abstract createSpecie(input?: SpecieData): Specie | Promise<Specie>;

    abstract editSpecie(id?: string, input?: SpecieData): Specie | Promise<Specie>;

    abstract deleteSpecie(id?: string): Specie | Promise<Specie>;

    abstract createStoragePond(input?: StoragePondData): StoragePond | Promise<StoragePond>;

    abstract editStoragePond(id?: string, input?: StoragePondData): StoragePond | Promise<StoragePond>;

    abstract deleteStoragePond(id?: string): StoragePond | Promise<StoragePond>;

    abstract changeStatusStoragePond(id?: string): StoragePond | Promise<StoragePond>;

    abstract emptyStoragePond(id?: string): StoragePond | Promise<StoragePond>;

    abstract addLiters(id?: string, liters?: number): StoragePond | Promise<StoragePond>;

    abstract createTransportBatch(input?: InputTransportBatch): TransportBatch | Promise<TransportBatch>;

    abstract editTransportBatch(id?: string, input?: InputTransportBatchEdit): TransportBatch | Promise<TransportBatch>;

    abstract deleteTransportBatch(id?: string): TransportBatch | Promise<TransportBatch>;

    abstract toAssignTransportBatchToPelequenGuide(id?: string, idPelequenGuide?: string): TransportBatch | Promise<TransportBatch>;

    abstract createUser(input?: UserData): User | Promise<User>;

    abstract editUser(id?: string, input?: UserDataEdit): User | Promise<User>;

    abstract blockUser(id?: string): User | Promise<User>;

    abstract unblockUser(id?: string): User | Promise<User>;

    abstract deleteUser(id?: string): User | Promise<User>;

    abstract changePassword(id?: string, password?: string): User | Promise<User>;

    abstract createVariety(input?: InputVariety): Variety | Promise<Variety>;

    abstract editVariety(id?: string, input?: InputVarietyEdit): Variety | Promise<Variety>;

    abstract deleteVariety(id?: string): Variety | Promise<Variety>;

    abstract createVarietyQuarter(input?: InputVarietyQuarter): VarietyQuarter | Promise<VarietyQuarter>;

    abstract editVarietyQuarter(input?: InputVarietyQuarter): VarietyQuarter | Promise<VarietyQuarter>;

    abstract deleteVarietyQuarter(input?: InputVarietyQuarter): VarietyQuarter | Promise<VarietyQuarter>;
}

export class LoginResponse {
    token: string;
    user?: User;
}

export abstract class IQuery {
    abstract getBins(): Bin[] | Promise<Bin[]>;

    abstract getCards(): Card[] | Promise<Card[]>;

    abstract getCleaningsLine(): CleaningLine[] | Promise<CleaningLine[]>;

    abstract getCleaningsStoragePonds(): CleaningStoragePond[] | Promise<CleaningStoragePond[]>;

    abstract getEstates(): Estate[] | Promise<Estate[]>;

    abstract getMacrozones(): Macrozone[] | Promise<Macrozone[]>;

    abstract getPelequenGuides(): PelequenGuide[] | Promise<PelequenGuide[]>;

    abstract getPhytosanitaryRegisters(): PhytosanitaryRegister[] | Promise<PhytosanitaryRegister[]>;

    abstract getPhytosanitaryRegistersProducts(): PhytosanitaryRegisterProduct[] | Promise<PhytosanitaryRegisterProduct[]>;

    abstract getProcessBatchs(): ProcessBatch[] | Promise<ProcessBatch[]>;

    abstract getProducts(): Product[] | Promise<Product[]>;

    abstract getQuarters(): Quarter[] | Promise<Quarter[]>;

    abstract getRoles(): Role[] | Promise<Role[]>;

    abstract getSaveBatchs(): SaveBatch[] | Promise<SaveBatch[]>;

    abstract getSections(): Section[] | Promise<Section[]>;

    abstract getSpecies(): Specie[] | Promise<Specie[]>;

    abstract getStoragePonds(): StoragePond[] | Promise<StoragePond[]>;

    abstract getTransportBatchs(): TransportBatch[] | Promise<TransportBatch[]>;

    abstract getUsers(): User[] | Promise<User[]>;

    abstract getVarieties(): Variety[] | Promise<Variety[]>;

    abstract getVarietiesQuarters(): VarietyQuarter[] | Promise<VarietyQuarter[]>;
}

export class Bin {
    id: string;
    idBins: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Card {
    id: string;
    idCard: string;
    date: Date;
    quadrille: string;
    percentageVolume: number;
    harvestType: string;
    grossWeight?: number;
    contractor: string;
    condition: string;
    estimatedWeight: number;
    bins: Bin;
    processBatch?: ProcessBatch;
    userRegister: User;
    userWeight?: User;
    variety: Variety;
    saveBatch?: SaveBatch;
    transportBatch?: TransportBatch;
    quarter: Quarter;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class CleaningLine {
    id: string;
    idCleaningLine: string;
    date: Date;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class CleaningStoragePond {
    id: string;
    idCleaningStoragePond: string;
    date: Date;
    storagePond: StoragePond;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Estate {
    id: string;
    idEstate: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Macrozone {
    id: string;
    idMacrozone: string;
    name: string;
    estate?: Estate;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class PelequenGuide {
    id: string;
    idPelequenGuide: string;
    document: string;
    name?: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class PhytosanitaryRegister {
    id: string;
    idPhytosanitaryRegister: string;
    startDate: Date;
    endDate: Date;
    user: User;
    product?: Product;
    section: Section;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class PhytosanitaryRegisterProduct {
    phytosanitaryRegister?: PhytosanitaryRegister;
    product?: Product;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class ProcessBatch {
    id: string;
    idProcessBatch?: string;
    date: Date;
    condition?: string;
    residualWeight?: number;
    generatedLiters?: number;
    user: User;
    saveBatch?: SaveBatch;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Product {
    id: string;
    idProduct: string;
    name: string;
    days: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Quarter {
    id: string;
    idQuarter: string;
    name: string;
    estimatedHarvestKg?: number;
    section: Section;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Role {
    id: string;
    idRole: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class SaveBatch {
    id: string;
    idSaveBatch?: string;
    date: Date;
    totalLiters?: number;
    condition?: string;
    storagePond: StoragePond;
    user: User;
    transportBatch?: TransportBatch;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Section {
    id: string;
    idSection: string;
    name: string;
    estimatedHarvestKg?: number;
    macrozone: Macrozone;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Specie {
    id: string;
    idSpecie: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class StoragePond {
    id: string;
    idStoragePond: string;
    capacitance: number;
    status: boolean;
    currentLiters?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class TransportBatch {
    id: string;
    idTransportBatch?: string;
    date: Date;
    pelequenGuide?: PelequenGuide;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class User {
    id: string;
    rut: string;
    name: string;
    email: string;
    password: string;
    passwordSalt: string;
    phone: string;
    position: string;
    state: boolean;
    role?: Role;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class Variety {
    id: string;
    idVariety: string;
    name: string;
    specie: Specie;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export class VarietyQuarter {
    variety?: Variety;
    quarter?: Quarter;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
