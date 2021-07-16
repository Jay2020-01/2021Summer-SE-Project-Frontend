import dayjs from 'dayjs';
// import res_new from './country_info.geojson'

export async function request(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
}

export async function request_new(url) {
  try {
    const res = await fetch(url,{mode:'cors'});
    // console.log('flag1');
    // console.log(res);
    // console.log('flag2');
    const data = res.json();//.parse
    // console.log('flag3');
    // console.log(...data);
    // console.log(data);
    // console.log('flag4');
    return data;
  } catch (e) {
    throw e;
  }
}

export async function getCoordinates() {
  try {
    const { latitude, longitude } = await request(
      'https://geolocation-db.com/json/'
    );

    return {
      latitude,
      longitude,
    };
  } catch (e) {
    throw e;
  }
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(date, format = 'MMMM D, YYYY') {
  return dayjs(date).format(format);
}
