const fs = require("fs");
const csv = require("../../js/csvReader.js");
const UPLOAD_FULL_PATH = '../../uploads';
const house201312_201509 = 'housePrice_201312_201509.csv';
const house201510_201706 = 'housePrice_201510_201706.csv';
const LOCAL_NAMES = ['서울','인천','경기','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주'];

let knou = {};
knou.convertHousePrice = function() {
  csv.csvReader(UPLOAD_FULL_PATH, house201510_201706, {headers:true, objectMode:true}, function(result){
      try{
        let values = result.values;
        let len = values.length;
        let resultMap = new Map();
        for(let i = 0; i < len; i += 1 ) {
          let data = values[i];
          if( data['규모구분'] === '전체' ) {
            let key = data['연도'] + '/' + data['월'];
            let valueMap;
            if( resultMap.has(key) ){
              valueMap = resultMap.get(key);
            } else {
              valueMap = new Map();
            }
            valueMap.set(data['지역명'], data['분양가격(㎡)']);
            resultMap.set(key, valueMap);
          }

        }

        let resultData = '';
        //make headers
        let firstKey = resultMap.keys().next().value;
        let firstData = resultMap.get(firstKey);
        resultData += '연도,';
        for(let [k,v] of firstData.entries()) {
            resultData += k + ',';
        }
        resultData += '\n';

        //make body
        let resultKeys = resultMap.keys();
        for(let key of resultKeys) {
          resultData += key + ',';
          for(let [k,v] of resultMap.get(key).entries()) {
              resultData += v +',';
          }
          resultData += '\n';
        }

        //console.log(resultData);
        console.log("success convertHousePrice..");
        fs.writeFileSync('../convert/전국분양가격_201510_201706.csv', resultData);
      }catch(err){
        console.error("convertHousePrice error : ",err);
      }
  });
};

knou.convertHousePriceDetail = function(localName) {
  csv.csvReader(UPLOAD_FULL_PATH, house201510_201706, {headers:true, objectMode:true}, function(result){
      try{
        let values = result.values;
        let len = values.length;
        let resultMap = new Map();
        for(let i = 0; i < len; i += 1 ) {
          let data = values[i];
          if( data['규모구분'] !== '전체' && data['지역명'] === localName ) {
            let key = data['연도'] + '/' + data['월'];
            let valueMap;
            if( resultMap.has(key) ){
              valueMap = resultMap.get(key);
            } else {
              valueMap = new Map();
            }
            valueMap.set(data['규모구분'], data['분양가격(㎡)']);
            resultMap.set(key, valueMap);
          }

        }

        let resultData = '';
        //make headers
        let firstKey = resultMap.keys().next().value;
        let firstData = resultMap.get(firstKey);
        resultData += '연도,';
        for(let [k,v] of firstData.entries()) {
            resultData += k + ',';
        }
        resultData += '\n';

        //make body
        let resultKeys = resultMap.keys();
        for(let key of resultKeys) {
          resultData += key + ',';
          let map = resultMap.get(key);
          let i = 0;
          let mapSize = map.size;
          for(let [k,v] of map.entries()) {
              resultData += v;
              if( (i + 1) !== mapSize) {
                resultData += ',';
              }
              i += 1;
          }
          resultData += '\n';
        }
        console.log("success convertHousePriceDetail : ",localName);
        fs.writeFileSync('../convert/전국분양가격상세_201510_201706_'+localName+'.csv', resultData);
      }catch(err){
        console.error("convertHousePriceDetail error : ",err);
      }
  });
};

knou.convertHousePriceOld = function() {
  csv.csvReader(UPLOAD_FULL_PATH, house201312_201509, {headers:true, objectMode:true}, function(result){
      try{
        let values = result.values;
        let resultMap = new Map();
        for(let row of values) {
          let rowKeys = Object.keys(row);
          for(let key of rowKeys) {
              if(key !== '지역') {
                let value = Number(row[key].replace(",","")) / 3.3;
                let valueMap;
                if(resultMap.has(key)){
                    valueMap = resultMap.get(key);
                }else {
                    valueMap = new Map();
                }
                valueMap.set(row['지역'],value.toFixed(0));
                resultMap.set(key, valueMap);
              }
          }
        }

        let resultData = '';
        //make headers
        let firstKey = resultMap.keys().next().value;
        let firstData = resultMap.get(firstKey);
        resultData += '연도,';
        for(let [k,v] of firstData.entries()) {
            resultData += k + ',';
        }
        resultData += '\n';

        //make body
        let resultKeys = resultMap.keys();
        for(let key of resultKeys) {
          resultData += key + ',';
          let map = resultMap.get(key);
          let mapSize = map.size;
          let count = 0;
          for(let [k,v] of map.entries()) {
              resultData += v;
              if( (count+1) !== mapSize ) {
                resultData += ',';
              }
              count += 1;
          }
          resultData += '\n';
        }
        console.log("success convertHousePriceOld..");
        fs.writeFileSync('../convert/전국분양가격_201312_201509.csv', resultData);
      }catch(err){
        console.error("convertHousePriceOld error : ",err);
      }
  });
};

knou.convertHousePrice();

for(let localName of LOCAL_NAMES) {
  knou.convertHousePriceDetail(localName);
}

knou.convertHousePriceOld();
/**
  '' 과 "" === 체크가 다른지 확인할것
*/
