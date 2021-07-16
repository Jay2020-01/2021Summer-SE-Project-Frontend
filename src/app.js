import {geojson_var} from './country_info copy.js';
import Globe from 'globe.gl';
import { request, getCoordinates, numberWithCommas, formatDate, request_new } from './index.js';
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
  // GEOJSON_URL2,
  CASES_API,
} from './constants';

import * as d3 from 'd3';


// Globe container
const globeContainer = document.getElementById('globeViz');

const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1 / 4);
const getVal = (feat) => {
  //console.log(feat.properties.NAME+"国家"+feat);
  //ShowObjProperty2(feat);
  return feat.covidData.confirmed / feat.properties.POP_EST;
};//箭头函数，()中是用到的参数，=>后是函数体
//console.log(feat.properties.NAME+"国家"+feat)
//feat.properties.NAME 国家名称
//feat.covidData.confirmed 确诊人数
//feat.properties.POP_EST 人口数量


/*function ShowObjProperty2( obj ) {
  // 用来保存所有的属性名称和值
  var outputMessage='';
  // 开始遍历
  for ( var p in obj ){
      
          outputMessage += '打印：' + p + " = " + obj[p] + "\r\n" ;
          console.log(outputMessage);
      
  }
  // 最后显示所有的属性
  //return attributes, methods
}*/


let world;
let flagName;
const flagEndpoint = 'https://corona.lmao.ninja/assets/img/flags';


export function init(globe_div,earth_width) {
  //console.log("init export sucess！");
 
  world = Globe()(globe_div)
    .globeImageUrl(GLOBE_IMAGE_URL)
    .backgroundColor('#426ab3')
    //.backgroundImageUrl('https://imgtu.com/i/WEazCQ')//BACKGROUND_IMAGE_URL
    .showGraticules(false)
    .polygonAltitude(0.06)
    .polygonCapColor((feat) => colorScale(getVal(feat)))//根据确诊人数占总人口的百分比，计算出一个颜色，给地图上对应图形
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.05)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel(({ properties: d, covidData: c }) => {
      if (d.ADMIN === 'France') {
        flagName = 'fr';
      } else if (d.ADMIN === 'Norway') {
        flagName = 'no';
      } 
      else if(d.ADMIN === 'Taiwan'){
        d.NAME = 'Taiwan,China';
        flagName = 'cn';
      }
       else {
        flagName = d.ISO_A2.toLowerCase();//c.confirmed
      }

      return `
        <div style="font-family: 'Space Mono', monospace;
        transition: 0.3s;
        background-color: black;
        width: 190px;
        border: 2px solid steelblue;
        border-radius: 10px;
        z-index: 2;">
          <img style="object-fit: contain;
          width: 100%;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;" src="${flagEndpoint}/${flagName}.png" alt="flag" />
          <div style="padding-top: 1px;
          padding-bottom: 8px;
          padding-left: 12px;
          padding-right: 12px;
          text-align: left;">
             <span style="font-weight: bold;"><b>${d.NAME}</b></span> <br />
             <div style="height: 5px;"></div>
             <hr />
             <div style="height: 5px;"></div>

             <span>Cases: ${numberWithCommas(c.confirmed)}</span>  <br />
             <span>Deaths: ${numberWithCommas(c.deaths)}</span> <br />
             
             <span>Recovered: ${numberWithCommas(c.recoveries)}</span> <br />
             <span>Population: ${d3.format('.3s')(d.POP_EST)}</span>
          </div>
        </div>
      `;
    })//line 1: div class="card2"
    .onPolygonHover((hoverD) =>
      world
        .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
        .polygonCapColor((d) =>
          d === hoverD ? 'steelblue' : colorScale(getVal(d))
        )
    )
    .polygonsTransitionDuration(200);
    //console.log("world.width:"+world.width+',window.innerWidth:'+window.innerWidth);
    world.width(earth_width);
    console.log("earth_width when initialize:"+earth_width);
    


  getCases();
}

let dates = [];
let countries = [];
let featureCollection = [];
let featureCollection2 = [];

// // Play button
// const playButton = document.querySelector('.play-button');
// // Slider
// const slider = document.querySelector('.slider');
// // Slider date
// const sliderDate = document.querySelector('.slider-date');

export function polygonFromCenter(center, radius=0.5, num=10) {//center, radius=0.5, num=10
  let coords = [];
  for (let i = 0; i < num; i++) {
    const dx = radius*Math.cos(2*Math.PI*i/num);
    const dy = radius*Math.sin(2*Math.PI*i/num);
    coords.push([center[0] + dx, center[1] + dy]);
  }
  return [coords];
}

//从数据源获取数据并 调用了三个函数《-？
export async function getCases() {
  countries = await request(CASES_API);//疫情信息
  //console.log("GEOJSON_URL:"+GEOJSON_URL);
  
  //featureCollection = (await request(GEOJSON_URL)).features;//国家信息
  featureCollection = geojson_var.features;
  console.log(featureCollection);
  

  // featureCollection2 = (await request(GEOJSON_URL2)).features.map(d => {
  //   d.geometry.type = "Polygon";
  //   d.geometry.coordinates = polygonFromCenter(d.geometry.coordinates);
  //   return d;
  // });
  // featureCollection = featureCollection.concat(featureCollection2);

  // world.polygonsData(countriesWithCovid);
  // document.querySelector('.title-desc').innerHTML =
  //   'Hover on a country or territory to see cases, deaths, and recoveries.';

  dates = Object.keys(countries.China);//data是数组，存放了所有日期
  //console.log(...dates);
  

  //new copy
//  Play button
const playButton = document.querySelector('.play-button');
// Slider
const slider = document.querySelector('.slider');
// Slider date
const sliderDate = document.querySelector('.slider-date');
//new copy end

  // Set slider values
  slider.max = dates.length - 1;
  slider.value = dates.length - 1;

  slider.disabled = false;
  playButton.disabled = false;

  //？
  //console.log("flag1");

  
  

  updateCounters();
  updatePolygonsData();

  updatePointOfView();
}

// const infectedEl = document.querySelector('#infected');
// const deathsEl = document.querySelector('#deaths');
// const recoveriesEl = document.querySelector('#recovered');
// const updatedEl = document.querySelector('.updated');

export function updateCounters() {

  //new copy
//  Play button
const playButton = document.querySelector('.play-button');
// Slider
const slider = document.querySelector('.slider');
// Slider date
const sliderDate = document.querySelector('.slider-date');
//new copy end

  sliderDate.innerHTML = dates[slider.value];//坐标中日期显示
  //console.log("sliderDate.innerHTML:"+sliderDate.innerHTML);

  let totalConfirmed = 0;
  let totalDeaths = 0;
  let totalRecoveries = 0;

  //item是每个国家名，countries里面存放每个国家：国家每日疫情信息（包含截止到某日的确诊、恢复、死亡）
  //slider.value是数据轴的值，dates是存放了日期的数组，dates[slider.value]是其对应的日期
  Object.keys(countries).forEach((item) => {
    if (countries[item][dates[slider.value]]) {
      //console.log(item);
      const countryDate = countries[item][dates[slider.value]];
      totalConfirmed += +countryDate.confirmed;//+countryDate.confirmed
      totalDeaths += +countryDate.deaths;
      totalRecoveries += countryDate.recoveries ? +countryDate.recoveries : 0;//为什么要加+？为啥这里有个判断？
    }
  });

//new copy
const infectedEl = document.querySelector('#infected');
const deathsEl = document.querySelector('#deaths');
const recoveriesEl = document.querySelector('#recovered');
const updatedEl = document.querySelector('.updated');
//new copy end

  infectedEl.innerHTML = numberWithCommas(totalConfirmed);
  deathsEl.innerHTML = numberWithCommas(totalDeaths);
  recoveriesEl.innerHTML = numberWithCommas(totalRecoveries);

  updatedEl.innerHTML = `(截止 ${formatDate(dates[slider.value])})`;
}

//countries存入了data.json文件的数据，在这里放入了featureCollection
export function updatePolygonsData() {
  //new copy
//  Play button
//const playButton = document.querySelector('.play-button');
// Slider
const slider = document.querySelector('.slider');
// Slider date
//const sliderDate = document.querySelector('.slider-date');
//new copy end
  for (let x = 0; x < featureCollection.length; x++) {
    const country = featureCollection[x].properties.NAME;
    if (countries[country]) {
      featureCollection[x].covidData = {
        confirmed: countries[country][dates[slider.value]].confirmed,
        deaths: countries[country][dates[slider.value]].deaths,
        recoveries: countries[country][dates[slider.value]].recoveries,
      };
    } else {
      featureCollection[x].covidData = {
        confirmed: 0,
        deaths: 0,
        recoveries: 0,
      };
    }
  }

  const maxVal = Math.max(...featureCollection.map(getVal));
  colorScale.domain([0, maxVal]);
  world.polygonsData(featureCollection);
}

export async function updatePointOfView() {
  // Get coordinates
  try {
    const { latitude, longitude } = await getCoordinates();

    world.pointOfView(
      {
        lat: latitude,
        lng: longitude,
      },
      1000
    );
  } catch (e) {
    console.log('Unable to set point of view.');
  }
}

let interval;

//playButton.addEventListener('click', () => {
export function play_button_click(){  //new copy
  //  Play button
  const playButton = document.querySelector('.play-button');
  //console.log("before playButton:"+playButton);
  // Slider
  const slider = document.querySelector('.slider');
  // Slider date
  const sliderDate = document.querySelector('.slider-date');
  //new copy end

  //console.log("flag2");
  if (playButton.innerText === 'Play') {
    playButton.innerText = 'Pause';
  } else {
    playButton.innerText = 'Play';
    clearInterval(interval);
    return;
  }

  // Check if slider position is max
  if (+slider.value === dates.length - 1) {
    slider.value = 0;
  }

  sliderDate.innerHTML = dates[slider.value];

  interval = setInterval(() => {
    slider.value++;
    sliderDate.innerHTML = dates[slider.value];
    updateCounters();
    updatePolygonsData();
    if (+slider.value === dates.length - 1) {
      playButton.innerHTML = 'Play';
      clearInterval(interval);
    }
  }, 200);
 };

// if ('oninput' in slider) {
//   slider.addEventListener(
//     'input',
//     function () {
//       updateCounters();
//       updatePolygonsData();
//     },
//     false
//   );
// }

// // Responsive globe 窗口改变时重置大小
// window.addEventListener('resize', (event) => {
  // world.width([event.target.innerWidth]);
  // world.height([event.target.innerHeight]);
// });

// export function change_world_size(){//直接在别的地方调整，要自动不要函数！
//   document.querySelector('#globeViz');
//   world.width([100]);
//   world.height([100]);
// }

// export function earthResize(){
//   const playButton = document.querySelector('.play-button');
//   const globe_div=document.getElementById('#globeViz');
//   console.log("playButton:"+playButton+',globe_div:'+globe_div);

//  // world.width(globe_div.scrollWidth);
//   console.log("window resize now!");
// }