import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BinsRepository } from '../../repository/bins.repository';
import { ProcessBatchsRepository } from '../../repository/processBatchs.repository';
import { UsersRepository } from '../../repository/users.repository';
import { VarietiesRepository } from '../../repository/varieties.repository';
import { QuartersRepository } from '../../repository/quarters.repository';
import { SaveBatchsRepository } from '../../repository/saveBatchs.repository';
import { TransportBatchsRepository } from '../../repository/transportBatchs.repository';
import { CardsRepository } from '../../repository/cards.repository';
import { Card, InputCard } from '../../graphql.schema';
import { ProcessBatchs, SaveBatchs } from 'src/entities';

@Injectable()
export class CardsService {
    private logger: Logger = new Logger(CardsService.name);

    constructor(
        @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
        @InjectRepository(BinsRepository) private binsRepository: BinsRepository,
        @InjectRepository(ProcessBatchsRepository)
        private processBatchsRepository: ProcessBatchsRepository,
        @InjectRepository(VarietiesRepository)
        private varietiesRepository: VarietiesRepository,
        @InjectRepository(QuartersRepository)
        private quartersRepository: QuartersRepository,
        @InjectRepository(SaveBatchsRepository)
        private saveBatchsRepository: SaveBatchsRepository,
        @InjectRepository(TransportBatchsRepository)
        private transportBatchsRepository: TransportBatchsRepository,
        @InjectRepository(CardsRepository) private cardsRepository: CardsRepository,
    ) { }

    async getCards(): Promise<Card[]> {
        try {
            this.logger.debug(`getting Cards`);
            return await this.cardsRepository.getCards();
        } catch (error) {
            throw new Error('Error en obtener tarjas');
        }
    }

    async createCard(cardData: InputCard): Promise<Card> {
        try {
            this.logger.debug(`creating Card with data=`, JSON.stringify(cardData));
            const {
                quadrille,
                date,
                idCard,
                percentageVolume,
                harvestType,
                contractor,
                condition,
                estimatedWeight,
                idBins,
                idUserRegister,
                idVariety,
                idQuarter
            } = cardData;

            if (!quadrille) {
                throw new HttpException(
                    'Parametro cuadrilla es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha is indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!percentageVolume) {
                throw new HttpException(
                    'Parametro porcentaje de volumen es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!harvestType) {
                throw new HttpException(
                    'Parametro tipo de cosecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!contractor) {
                throw new HttpException(
                    'Parametro contratista es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!condition) {
                throw new HttpException(
                    'Parametro condicion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!estimatedWeight) {
                throw new HttpException(
                    'Parametro peso estimado es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idBins) {
                throw new HttpException(
                    'Parametro idBins es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idUserRegister) {
                throw new HttpException(
                    'Parametro id usuario que registra es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cardById = await this.cardsRepository.findOne({
                where: { idCard: idCard, deletedAt: null },
            });

            if (cardById) {
                throw new HttpException(
                    `Tarja con id ${idCard} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userRegisterById = await this.usersRepository.findOne({
                where: { id: idUserRegister, deletedAt: null },
            });

            if (!userRegisterById) {
                throw new HttpException(
                    `Usuario con id ${idUserRegister} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsById = await this.binsRepository.findOne({
                where: { id: idBins, deletedAt: null },
            });

            if (!binsById) {
                throw new HttpException(
                    `Bins con id ${idBins} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.findOne({
                where: { id: idVariety, deletedAt: null },
            });

            if (!varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                where: { id: idQuarter, deletedAt: null },
            });

            if (!quarterById) {
                throw new HttpException(
                    `Variedad con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.binsRepository.changeBinsNotAvailable(binsById.id);

            const card = await this.cardsRepository.insertOrUpdateCard(
                cardData,
                userRegisterById,
                binsById,
                varietyById,
                quarterById,
                null,
            );

            const cardCatch = await this.cardsRepository.getCardByAttribute('', card);

            const cardIdGenerated = await this.cardsRepository.idTransform(cardCatch);

            return this.cardsRepository.getCardByAttribute('', cardIdGenerated);

        } catch (error) {
            throw error;
        }
    }

    async createNCard(cant: number, cardData: InputCard): Promise<Card> {
        try {
            this.logger.debug(`creating Card with data=`, JSON.stringify(cardData));
            const {
                quadrille,
                date,
                idCard,
                percentageVolume,
                harvestType,
                contractor,
                condition,
                idBins,
                idUserRegister,
                idVariety,
                idQuarter
            } = cardData;

            if (!quadrille) {
                throw new HttpException(
                    'Parametro cuadrilla es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha is indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCard) {
                throw new HttpException(
                    'Parametro idTarja es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!percentageVolume) {
                throw new HttpException(
                    'Parametro porcentaje de volumen es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!harvestType) {
                throw new HttpException(
                    'Parametro tipo de cosecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!contractor) {
                throw new HttpException(
                    'Parametro contratista es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!condition) {
                throw new HttpException(
                    'Parametro condicion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idBins) {
                throw new HttpException(
                    'Parametro idBins es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idUserRegister) {
                throw new HttpException(
                    'Parametro id usuario que registra es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cardById = await this.cardsRepository.findOne({
                where: { idCard: idCard },
            });

            if (cardById) {
                throw new HttpException(
                    `Tarja con id ${idCard} existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userRegisterById = await this.usersRepository.findOne({
                where: { id: idUserRegister },
            });

            if (!userRegisterById) {
                throw new HttpException(
                    `Usuario con id ${idUserRegister} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsById = await this.binsRepository.findOne({
                where: { id: idBins },
            });

            if (!binsById) {
                throw new HttpException(
                    `Bins con id ${idBins} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.findOne({
                where: { id: idVariety, deletedAt: null },
            });

            if (!varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                where: { id: idQuarter, deletedAt: null },
            });

            if (!quarterById) {
                throw new HttpException(
                    `Variedad con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const card = await this.cardsRepository.insertNCard(
                cant,
                cardData,
                userRegisterById,
                binsById,
                varietyById,
                quarterById,
                null,
            );

            return card;
        } catch (error) {
            throw error;
        }
    }

    async editCard(id: string, cardData: InputCard): Promise<Card> {
        try {
            this.logger.debug(
                `updating Card with data=${JSON.stringify(cardData)} and ID=${id}`,
            );
            const {
                quadrille,
                date,
                idCard,
                percentageVolume,
                harvestType,
                contractor,
                condition,
                estimatedWeight,
                idBins,
                idUserRegister,
                idVariety,
                idQuarter
            } = cardData;

            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!quadrille) {
                throw new HttpException(
                    'Parametro cuadrilla es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!date) {
                throw new HttpException(
                    'Parametro fecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idCard) {
                throw new HttpException(
                    'Parametro idTarja es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!percentageVolume) {
                throw new HttpException(
                    'Parametro porcentaje de volumen es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!harvestType) {
                throw new HttpException(
                    'Parametro tipo de cosecha es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!contractor) {
                throw new HttpException(
                    'Parametro contratista es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!condition) {
                throw new HttpException(
                    'Parametro condicion es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!estimatedWeight) {
                throw new HttpException(
                    'Parametro peso estimado es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idBins) {
                throw new HttpException(
                    'Parametro idBins es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idUserRegister) {
                throw new HttpException(
                    'Parametro id usuario que registra es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idVariety) {
                throw new HttpException(
                    'Parametro idVariedad es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idQuarter) {
                throw new HttpException(
                    'Parametro idCuartel es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cardById = await this.cardsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!cardById) {
                throw new HttpException(
                    `Tarja con id ${idCard} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userRegisterById = await this.usersRepository.findOne({
                where: { id: idUserRegister, deletedAt: null },
            });

            if (!userRegisterById) {
                throw new HttpException(
                    `Usuario con id ${idUserRegister} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsById = await this.binsRepository.findOne({
                where: { id: idBins, deletedAt: null },
            });

            if (!binsById) {
                throw new HttpException(
                    `Bins con id ${idBins} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const varietyById = await this.varietiesRepository.findOne({
                where: { id: idVariety, deletedAt: null },
            });

            if (!varietyById) {
                throw new HttpException(
                    `Variedad con id ${idVariety} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const quarterById = await this.quartersRepository.findOne({
                where: { id: idQuarter, deletedAt: null },
            });

            if (!quarterById) {
                throw new HttpException(
                    `Variedad con id ${idQuarter} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const card = await this.cardsRepository.insertOrUpdateCard(
                cardData,
                userRegisterById,
                binsById,
                varietyById,
                quarterById,
                cardById
            );

            return this.cardsRepository.getCardByAttribute('', card);

        } catch (error) {
            throw error;
        }
    }

    async deleteCard(id: string): Promise<Card> {
        try {
            this.logger.debug(`deleting Card`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cardById = await this.cardsRepository.getCardByAttribute('', id);

            if(!cardById) {
                throw new HttpException(
                    `Tarja con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const binsCard = await this.binsRepository.findOne({
                where: { id: cardById.bins, deletedAt: null },
            });

            if (!binsCard) {
                throw new HttpException(
                    `Bins con id ${cardById.bins} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this.binsRepository.changeBinsAvailable(binsCard.id);

            const card = await this.cardsRepository.deleteCard(id);

            return card;
        } catch (error) {
            throw error;
        }
    }

    async toAssignCardToProcessBatch(id: string[], idProcessBatch: string): Promise<Card[]> {
        try {
            this.logger.debug(`assign Cards to proccess batch with id=${idProcessBatch}`);

            if (id.length <= 0) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idProcessBatch) {
                throw new HttpException(
                    'Parametro idLoteProceso es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const cards = [];

            await Promise.all(id.map(async (value) => {
                const cardById = await this.cardsRepository.findOne({
                    where: { id: value, deletedAt: null },
                });

                const binsById = await this.binsRepository.findOne({
                    where: { id: cardById.bins, deletedAt: null },
                });

                await this.binsRepository.changeBinsAvailable(binsById.id);

                cards.push(cardById);
            }));

            if (cards.length <= 0) {
                throw new HttpException(
                    `Tarjas no existen`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const proccessBatchById = await this.processBatchsRepository.findOne({
                where: { id: idProcessBatch, deletedAt: null },
            });

            if (!proccessBatchById) {
                throw new HttpException(
                    `Lote de proceso con id ${idProcessBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }



            const cardsIds = await this.cardsRepository.assignCardToProccessBatch(cards, proccessBatchById);
            return await this.cardsRepository.getCardsByIds(cardsIds);
        } catch (error) {
            throw error;
        }
    }

    async toAssignProcessBatchToSaveBatch(id: string[], idSaveBatch: string): Promise<ProcessBatchs[]> {
        try {
            this.logger.debug(`assing process batch to save batch with id=${idSaveBatch}`);

            if (id.length <= 0) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idSaveBatch) {
                throw new HttpException(
                    'Parametro idLoteGuarda es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const processBatchs = [];

            await Promise.all(id.map(async (value) => {
                const processBatchById = await this.processBatchsRepository.findOne({
                    where: { id: value, deletedAt: null },
                });

                processBatchs.push(processBatchById);
            }));

            if (processBatchs.length <= 0) {
                throw new HttpException(
                    `process batchs no existen`,
                    HttpStatus.BAD_REQUEST,
                )
            }

            const savesBatchById = await this.saveBatchsRepository.findOne({
                where: { id: idSaveBatch, deletedAt: null },
            });

            if (!savesBatchById) {
                throw new HttpException(
                    `Lote de Guarda con id ${idSaveBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const idsProcessBatch = await Promise.all(processBatchs.map(async (processBatch: ProcessBatchs) => {
                processBatch.saveBatch = savesBatchById;
                await this.processBatchsRepository.save(processBatch);
                return processBatch.id
            }));

            return this.processBatchsRepository.getProcessBatchsByIds(idsProcessBatch);
        } catch (error) {
            throw error;
        }
    }

    async toAssignSaveBatchToTransportBatch(id: string[], idTransportBatch: string): Promise<SaveBatchs[]> {
        try {
            this.logger.debug(`assing save batchs to transport batch with id=${idTransportBatch}`);

            if (id.length <= 0) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!idTransportBatch) {
                throw new HttpException(
                    'Parametro idLoteTransporte es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const saveBatchs = [];

            await Promise.all(id.map(async (value) => {
                const saveBatchById = await this.saveBatchsRepository.findOne({
                    where: { id: value, deletedAt: null },
                });

                saveBatchs.push(saveBatchById);
            }));

            if (saveBatchs.length <= 0) {
                throw new HttpException(
                    `save batchs no existen`,
                    HttpStatus.BAD_REQUEST,
                )
            }

            const transportBatchById = await this.transportBatchsRepository.findOne({
                where: { id: idTransportBatch, deletedAt: null },
            });

            if (!transportBatchById) {
                throw new HttpException(
                    `Lote de Transporte con id ${idTransportBatch} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const idsSaveBatch = await Promise.all(saveBatchs.map(async (saveBatch: SaveBatchs) => {
                saveBatch.transportBatch = transportBatchById;
                await this.saveBatchsRepository.save(saveBatch);
                return saveBatch.id
            }));

            return this.saveBatchsRepository.getSaveBatchsByIds(idsSaveBatch);

        } catch (error) {
            throw error;
        }
    }

    async toAssignWeigthToCard(id: string, userWeight: string, grossWeight: number): Promise<Card> {
        try {
            this.logger.debug(`assign Weight with value=${grossWeight} to card with id=${id}`);
            if (!id) {
                throw new HttpException(
                    'Parametro id es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!userWeight) {
                throw new HttpException(
                    'Parametro idUsuario es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!grossWeight) {
                throw new HttpException(
                    'Parametro peso neto es indefinido',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const cardById = await this.cardsRepository.findOne({
                where: { id: id, deletedAt: null },
            });

            if (!cardById) {
                throw new HttpException(
                    `Tarja con id ${id} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const userWeightById = await this.usersRepository.findOne({
                where: { id: userWeight, deletedAt: null },
            });

            if (!userWeightById) {
                throw new HttpException(
                    `Usuario que registra peso con id ${userWeight} no existe`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            return await this.cardsRepository.assignWeigthToCard(cardById, userWeightById, grossWeight);

        } catch (error) {
            throw error;
        }
    }
}
