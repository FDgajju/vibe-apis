import type { Model, PopulateOptions } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { catchHandler } from "../utils/catchHandler";
import { AppError } from "../utils/AppError";
import APIFeatures from "../utils/apiFeatures";

export const deleteOne = <T>(model: Model<T>) =>
  catchHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const doc = await model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError("No document found with this id", 404));
    }

    res.status(204).send({
      status: true,
      message: "Operation successful",
      error: null,
      data: null,
    });
  });

export const updateOne = <T>(model: Model<T>) =>
  catchHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      body: data,
      params: { id },
    } = req;

    const doc = await model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(new AppError("Document not found", 404));
    }

    res.status(200).send({
      status: true,
      message: "Operation successful",
      error: null,
      data: doc,
    });
  });

export const createOne = <T>(model: Model<T>) =>
  catchHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { body } = req;
    const doc = await model.create(body);

    res.status(201).json({
      status: true,
      message: "Operation successful",
      error: null,
      data: doc,
    });
  });

export const getOne = <T>(
  model: Model<T>,
  populateOptions?: PopulateOptions | (string | PopulateOptions)[]
) =>
  catchHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;

    let query = model.findById(id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("Document not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Operation successful",
      error: null,
      data: doc,
    });
  });

export const getAll = <T>(
  model: Model<T>,
  populateOptions?: PopulateOptions | (string | PopulateOptions)[]
) =>
  catchHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { query } = req;

    const features = new APIFeatures(model.find({}), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (populateOptions)
      features.query = features.query.populate(populateOptions);

    const [doc, docCount] = await Promise.all([
      features.query,
      model.countDocuments(features.filterPayload),
    ]);

    const limit = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const totalPages = Math.ceil(docCount / limit);

    res.status(200).json({
      status: true,
      error: null,
      meta: {
        limit,
        currentPage,
        totalPages,
        result: docCount,
      },
      message: "Operation successful",
      data: doc,
    });
  });
