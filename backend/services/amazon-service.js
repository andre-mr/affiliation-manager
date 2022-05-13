// import fetch from 'node-fetch';
const fetch = require("node-fetch");

let startDate, endDate;

let url = '';

const headers = {
  'Cookie': process.env.AMAZON_COOKIE
}

function setUrl(realtime) {
  if (realtime) {
    url = 'https://associados.amazon.com.br/home/reports/table.json'
      + '?query[type]=realtime'
      + '&query[start_date]=' + startDate
      + '&query[end_date]=' + endDate
      + '&query[order]=desc'
      + '&query[tag_id]=all'
      + '&query[columns]=tag_id,product_title,asin,product_category,merchant_name,ordered_items,tracking_id,price'
      + '&query[skip]=0'
      + '&query[sort]=day'
      + '&query[limit]=100000'
      + '&store_id=cpetrag0f7-20';
  } else {
    url = 'https://associados.amazon.com.br/home/reports/table.json'
      + '?query[type]=earnings'
      + '&query[start_date]=' + startDate
      + '&query[end_date]=' + endDate
      + '&query[tag_id]=all'
      + '&query[order]=desc'
      + '&query[device_type]=all'
      + '&query[last_accessed_row_index]=0'
      + '&query[group_by]=tag_id'
      + '&query[columns]=tag_value,tag_id,product_title,price,fee_rate,shipped_items,revenue,commission_earnings,asin,returned_items,returned_revenue,returned_earnings'
      // + '&query[group]='
      + '&query[skip]=0'
      + '&query[sort]=shipped_items'
      + '&query[limit]=100000'
      + '&store_id=cpetrag0f7-20';
  }
}

async function getAmazonData(queryStartDate, queryEndDate) {
  startDate = queryStartDate;
  endDate = queryEndDate;
  let todayDate = new Date();
  if (startDate.substring(8, 10) == todayDate.getDate().toString().padStart(2, "0")) {
    endDate = startDate;
    setUrl(true);
  } else {
    setUrl(false);
  }

  let result;
  await fetch(url, { method: "GET", headers: headers })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      result = json.records;
    });
  return result;
}

// export default { getAmazonData };
module.exports = {
  getAmazonData,
};