import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import {
    Users,
    Bins,
    ProcessBatchs,
    Varieties,
    SaveBatchs,
    TransportBatchs,
    Quarters
} from 'src/entities';
import { Card, InputCard } from 'src/graphql.schema';
import { Repository, EntityRepository, In } from 'typeorm';
import { Cards } from '../entities/cards.entity';

@Injectable()
@EntityRepository(Cards)
export class CardsRepository extends Repository<Cards> {
    public async getCards(): Promise<Cards[]> {
        try {
            return this.find({
                relations: [
                    'userRegister',
                    'userWeight',
                    'bins',
                    'processBatch',
                    'processBatch.user',
                    'processBatch.saveBatch',
                    'processBatch.saveBatch.transportBatch',
                    'variety',
                    'variety.specie',
                    'saveBatch',
                    'saveBatch.user',
                    'saveBatch.storagePond',
                    'saveBatch.transportBatch',
                    'transportBatch',
                    'transportBatch.pelequenGuide',
                    'transportBatch.pelequenGuide.user',
                    'quarter',
                    'quarter.section',
                    'quarter.section.macrozone',
                    'quarter.section.macrozone.estate'
                ],
                where: { deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async getCardsByIds(ids: string[]): Promise<Cards[]> {
        try {
            return this.find({
                relations: [
                    'userRegister',
                    'userWeight',
                    'bins',
                    'processBatch',
                    'processBatch.user',
                    'processBatch.saveBatch',
                    'processBatch.saveBatch.transportBatch',
                    'variety',
                    'variety.specie',
                    'saveBatch',
                    'saveBatch.user',
                    'saveBatch.storagePond',
                    'saveBatch.transportBatch',
                    'transportBatch',
                    'transportBatch.pelequenGuide',
                    'transportBatch.pelequenGuide.user',
                    'quarter',
                    'quarter.section',
                    'quarter.section.macrozone',
                    'quarter.section.macrozone.estate'
                ],
                where: { id: In(ids), deletedAt: null },
            });
        } catch (error) {
            throw error;
        }
    }

    public async getCardByAttribute(idCard?: string, id?: string): Promise<Cards> {
        try {
            if (idCard) {
                return await this.findOne({
                    where: { idCard: idCard, deletedAt: null },
                });
            }

            if (id) {
                return await this.findOne({
                    where: { id: id, deletedAt: null },
                });
            }

        } catch (error) {
            throw error;
        }
    }

    public async insertOrUpdateCard(
        cardData: InputCard,
        userRegister: Users,
        bins: Bins,
        variety: Varieties,
        quarter: Quarters,
        card: Cards,
    ): Promise<string> {
        try {
            const {
                idCard,
                date,
                quadrille,
                percentageVolume,
                harvestType,
                contractor,
                condition,
                estimatedWeight,
            } = cardData;

            if (card === null) {
                card = new Cards();
            }
            
            card.idCard = idCard;
            card.date = date;
            card.quadrille = quadrille;
            card.percentageVolume = percentageVolume;
            card.harvestType = harvestType;
            card.contractor = contractor;
            card.condition = condition;
            card.estimatedWeight = estimatedWeight;
            card.userRegister = userRegister;
            card.bins = bins;
            card.variety = variety;
            card.quarter = quarter;

            await card.save();

            return card.id;
        } catch (error) {
            throw error;
        }
    }

    public async insertNCard(
        cant: number,
        cardData: InputCard,
        userRegister: Users,
        bins: Bins,
        variety: Varieties,
        quarter: Quarters,
        card: Cards,
    ): Promise<Card> {
        try {
            
            for(let i = 0; i < cant; i++){

                const {
                    idCard,
                    date,
                    quadrille,
                    percentageVolume,
                    harvestType,
                    contractor,
                    condition,
                } = cardData;
    
                if (card === null) {
                    card = new Cards();
                }
                
                card.idCard = idCard;
                card.date = date;
                card.quadrille = quadrille;
                card.percentageVolume = percentageVolume;
                card.harvestType = harvestType;
                card.contractor = contractor;
                card.condition = condition;
                card.userRegister = userRegister;
                card.bins = bins;
                card.variety = variety;
                card.quarter = quarter;
    
                await card.save();
    
                return card;
            }

            } catch (error) {
                throw error;
            }
  
    }

    public async deleteCard(id: string): Promise<Cards> {
        const card = await this.findOne(id);

        if (!card) {
            throw new HttpException(
                `Tarja con id=${id} no existe`,
                HttpStatus.BAD_REQUEST,
            );
        }
        card.deletedAt = new Date();
        await this.save(card);
        return card;
    }

    public async assignCardToProccessBatch(cards: Cards[], proccessBatch: ProcessBatchs): Promise<string[]> {
        try {
            return await Promise.all(cards.map(async(card) => {
                card.processBatch = proccessBatch;
                await this.save(card);
                return card.id
            }));
        } catch (error) {
            throw error;
        }
    }

    public async assignWeigthToCard(card: Cards, userWeight: Users, grossWeight: number): Promise<Cards> {
        card.userWeight = userWeight;
        card.grossWeight = grossWeight;

        await this.save(card);

        return card;
    }

    public async idTransform(card: Cards): Promise<string> {
        card.idCard = card.idCard + '-' + card.correlative;
        await this.save(card);

        return card.id;
    }
}
