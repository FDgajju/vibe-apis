import { connect } from 'mongoose';

export const connectMongodb = async (
  host: string,
  db: string,
  parameters: string,
  //   biome-ignore lint:
): Promise<any> => {
  try {
    const dbUri = `${host}/${db}?${parameters}`;

    const info = await connect(dbUri);

    return { status: true, data: info, error: null };
  } catch (error) {
    return { status: false, data: null, error };
  }
};
