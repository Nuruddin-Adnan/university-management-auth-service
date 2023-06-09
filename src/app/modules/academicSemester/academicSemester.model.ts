import { Query, Schema, model } from 'mongoose';
import { IAcademicSemester } from './academicSemester.interface';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      enum: academicSemesterTitles,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
      enum: academicSemesterCodes,
    },
    startMonth: {
      type: String,
      required: [true, 'Start month is required'],
      enum: academicSemesterMonths,
    },
    endMonth: {
      type: String,
      required: [true, 'End month is required'],
      enum: academicSemesterMonths,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

academicSemesterSchema.pre('save', async function (next) {
  const isExist = await AcademicSemester.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Academic semester is already exist !'
    );
  }
  next();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpdateQuery = Query<any, Document> & {
  _update: {
    title: string;
    year: number;
  };
};

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this as UpdateQuery;
  const { title, year } = query._update;

  const isExist = await AcademicSemester.findOne({ title, year });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Academic semester already exists!'
    );
  }
  next();
});

export const AcademicSemester = model<IAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema
);
