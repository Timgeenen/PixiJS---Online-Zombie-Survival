import { Document, Types } from 'mongoose';

export function docToObject<T extends { _id: Types.ObjectId }>(
    doc: Document & T,
): Omit<T, '_id'> & { _id: string } {
    const obj = doc.toObject();
    return {
        ...obj,
        _id: obj._id.toString(),
    };
}
