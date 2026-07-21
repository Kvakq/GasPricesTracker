// src/utils/formatPrices.js
export function getFormattedStations(rawData) {
  const pricesList = rawData.data.latestPrices;
  const stationsMap = {};

  pricesList.forEach(item => {
    // STRICT FILTER: Let through everything that isn't Neste
    if (item.companyName !== 'Neste') {
      return; 
    }

    if (!stationsMap[item.stationId]) {
      stationsMap[item.stationId] = {
        id: item.stationId,
        name: item.displayName,
        company: item.companyName,
        address: item.address,
        prices: {} 
      };
    }
    stationsMap[item.stationId].prices[item.name] = item.price;
  });

  return Object.values(stationsMap);
}