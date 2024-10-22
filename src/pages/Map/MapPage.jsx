import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './MapPage.css';

const washingtonCounties = [
  "Adams", "Asotin", "Benton", "Chelan", "Clallam", "Clark", "Columbia",
  "Cowlitz", "Douglas", "Ferry", "Franklin", "Garfield", "Grant", 
  "Grays Harbor", "Island", "Jefferson", "King", "Kitsap", "Kittitas", 
  "Klickitat", "Lewis", "Lincoln", "Mason", "Okanogan", "Pacific", 
  "Pend Oreille", "Pierce", "San Juan", "Skagit", "Skamania", "Snohomish", 
  "Spokane", "Stevens", "Thurston", "Wahkiakum", "Walla Walla", 
  "Whatcom", "Whitman", "Yakima"
];

function MapPage() {
  const mapRef = useRef(null); // Référence au conteneur SVG
  const hasRendered = useRef(false); // Empêche le double rendu

  useEffect(() => {
    if (hasRendered.current) return;
    hasRendered.current = true;

    const width = 960;
    const height = 600;

    const svg = d3.select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('visibility', 'hidden');

    d3.csv('/evdata.csv').then((data) => {
      const filteredData = data.filter(d => washingtonCounties.includes(d.County));

      const vehicleCountByCounty = d3.rollup(
        filteredData,
        (v) => v.length,
        (d) => d.County
      );

      d3.json('/wa_counties.json').then((geoData) => {
        const projection = d3.geoMercator().fitSize([width, height], geoData);
        const path = d3.geoPath().projection(projection);

        const maxVehicles = d3.max(Array.from(vehicleCountByCounty.values()));

        const colorScale = d3.scaleLinear()
          .domain([0, maxVehicles])
          .range(['#d4f1f4', '#00796b']);

        svg.selectAll('path')
          .data(geoData.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', (d) => {
            const countyName = d.properties.JURISDICT_LABEL_NM;
            const count = vehicleCountByCounty.get(countyName) || 0;
            return colorScale(count);
          })
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .on('mouseover', function (event, d) {
            const countyName = d.properties.JURISDICT_LABEL_NM;
            const count = vehicleCountByCounty.get(countyName) || 0;

            d3.select(this).attr('fill', '#ffa500'); // Changer la couleur au hover

            tooltip
              .style('visibility', 'visible')
              .style('opacity', 1) // Assurer que le tooltip devient visible
              .html(`<strong>${countyName}</strong><br>Vehicles: ${count}`);
          })
          .on('mousemove', function (event) {
            tooltip
              .style('top', `${event.clientY + 10}px`) // Utiliser clientY pour un meilleur positionnement
              .style('left', `${event.clientX + 10}px`);
          })
          .on('mouseout', function (event, d) {
            const countyName = d.properties.JURISDICT_LABEL_NM  ;
            const count = vehicleCountByCounty.get(countyName) || 0;

            d3.select(this).attr('fill', colorScale(count)); // Retour à la couleur initiale
            tooltip.style('visibility', 'hidden'); // Masquer le tooltip
          });
      }).catch((error) => {
        console.error('Erreur lors du chargement du GeoJSON :', error);
      });
    }).catch((error) => {
      console.error('Erreur lors du chargement des données CSV :', error);
    });
  }, []);

  return (
    <section className="map-page">
      <h2>Map of Washington State (EV Adoption & Charging Stations)</h2>
      <div id="map" className="map-container" ref={mapRef}></div>
    </section>
  );
}

export default MapPage;
