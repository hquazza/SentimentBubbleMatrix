import { makeBubbleMatrix } from "./makeBubbleMatrix.js";
import {saveChart } from "./saveChart.js";

// let data;  

const svgHeight = 800;
const svgWidth = 1200;

const svg = d3
  .select('#chart') //comes from Html doc
  .append('svg')
  .attr('height', svgHeight)
  .attr('width', svgWidth)
  .attr('id','svgID');
// <---------------------- CONSTANTS TO CHANGE ------------------------>

document.getElementById("file-upload").addEventListener("change", (event) => {
const file = event.target.files[0];
if (!file) {
  alert("No File Selected");
  return;
}


const reader = new FileReader();

reader.onload=async function(event){
const data = await d3.csvParse(event.target.result);

  makeBubbleMatrix(data,svg);
};

reader.readAsText(file);
});

// d3.csv('Mersey8.csv').then(data=> {
//   makeBubbleMatrix(data,svg)
// })

window.saveChart=saveChart //window one is from html 
