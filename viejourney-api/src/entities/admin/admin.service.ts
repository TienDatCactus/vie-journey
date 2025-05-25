
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from '../account/entities/account.entity';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>
  ) {}

// getAllAccounts
async getAllAccounts(): Promise<Account[]> {
return this.accountModel.find({ role: { $ne: 'ADMIN' } }).exec();
}

// getAccountById
async getAccountById(id: string): Promise<Account | null> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
        throw new Error(`Account with ID ${id} not found`);
    }
    return account;
}

// CREATE ACCOUNT
async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
   const existUser = await this.accountModel.findOne({email: createAccountDto.email})
    if (existUser) {
        throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);
    const newAccount = new this.accountModel({
        email: createAccountDto.email,
        password: hashedPassword,
        active: true, // Default to active
    });
    return newAccount.save();
    }

// deleteAccount
async deleteAccount(id: string): Promise<Account | null> {
    const account = await this.accountModel.findByIdAndDelete(id).exec();
    if (!account) {
        throw new Error(`Account with ID ${id} not found`);
    }
    return account;
}
}
