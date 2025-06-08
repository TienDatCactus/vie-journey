import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfos } from '../account/entities/userInfos.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('UserInfos') private readonly userInfosModel: Model<UserInfos>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async getAllUser(): Promise<UserInfos[]> {
        return this.userInfosModel.find().populate('userId').exec();
    }

    async getUserByID(id: string): Promise<UserInfos> {
        const user = await this.userInfosModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}