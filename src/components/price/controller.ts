
import { Price } from "./model";
import { getAll, getOne, createOne, updateOne, deleteOne } from "../handlerFactory";

export const createPrice = createOne(Price);
export const getAllPrices = getAll(Price);
export const getPrice = getOne(Price);
export const updatePrice = updateOne(Price);
export const deletePrice = deleteOne(Price);
