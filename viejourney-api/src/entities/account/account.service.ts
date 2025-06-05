import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
  ) {}
  async activateUser(userId: Types.ObjectId): Promise<void> {
    const user = await this.accountModel.findByIdAndUpdate(
      userId,
      { active: true },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');
  }
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }
  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }
  async findOne(id: string) {
    const account = await this.accountModel.findById(id);
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return {
      _id: account._id,
      email: account.email,
      active: account.active,
      role: account.role,
    };
  }
  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountModel.findOne({ email });
    if (!account) {
      throw new NotFoundException(`Account with email ${email} not found`);
    }
    return account;
  }
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedAccount) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<Account> {
    const deletedAccount = await this.accountModel.findByIdAndDelete(id).exec();
    if (!deletedAccount) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return deletedAccount;
  }
}
