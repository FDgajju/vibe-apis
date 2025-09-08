class FilterData {
  // biome-ignore lint:
  removeFields(dataObj: Record<any, any>, rest: string[]) {
    const newData = JSON.parse(JSON.stringify(dataObj));

    for (const el of rest) {
      delete newData[el];
    }

    return newData;
  }

  // biome-ignore lint:
  addFields(dataObj: Record<any, any>, rest: string[]) {
    // biome-ignore lint:
    const newData: Record<any, any> = {};

    for (const f of rest) {
      if (dataObj?.[f]) newData[f] = dataObj[f];
    }

    return newData;
  }
}

const filterData = new FilterData();

export { filterData };
