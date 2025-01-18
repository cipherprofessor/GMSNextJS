import mongoose, {Schema,Document} from 'mongoose';

export interface Message extends Document {
    name: string;
    email: string;
    password: string;
}