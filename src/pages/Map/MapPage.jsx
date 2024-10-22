import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './MapPage.css';

function MapPage() {
  useEffect(() => {
    const width = 960;
    const height = 600;

    // Supprimer le contenu précédent
    d3.select('#map').selectAll('*').remove();

    // Créer un conteneur SVG
    const svg = d3.select('#map')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Créer un tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#fff')
      .style('border', '1px solid #333')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 10px rgba(0, 0, 0, 0.1)');

    // Charger le fichier GeoJSON
    d3.json('/wa_counties.json')
      .then((data) => {
        const projection = d3.geoMercator().fitSize([width, height], data);
        const path = d3.geoPath().projection(projection);

        svg.selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', '#cccccc')
          .attr('stroke', '#333333')
          .attr('stroke-width', 1)
          .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', '#ffa500'); // Changer la couleur au hover
            tooltip.style('visibility', 'visible')
              .text(d.properties.JURISDICT_NM); // Afficher le nom du comté
          })
          .on('mousemove', function (event) {
            tooltip.style('top', (event.pageY - 10) + 'px')
              .style('left', (event.pageX + 10) + 'px');
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill', '#cccccc'); // Retour à la couleur initiale
            tooltip.style('visibility', 'hidden');
          });
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du GeoJSON :', error);
      });
  }, []);

  return (
    <section className="map-page">
      <h2>Map of Washington State (EV Adoption & Charging Stations)</h2>
      <div id="map" className="map-container"></div>
    </section>
  );
}

export default MapPage;
