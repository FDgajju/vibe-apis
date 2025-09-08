import type { Query } from "mongoose";
import type { AnyType } from "../types/globalTypes";

interface IQueryString {
  [key: string]: AnyType;
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  filterPayload?: AnyType;
}

class APIFeatures<T> {
  query: Query<T[], T>;
  queryString: IQueryString;
  filterPayload?: AnyType;

  constructor(query: Query<T[], T>, queryString: IQueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const filters: { [key: string]: unknown } = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete filters[el]);

    // FILTERING
    let queryStr = JSON.stringify(filters);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    this.filterPayload = filters || {};
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = String(this.queryString.sort).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = String(this.queryString.fields).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
