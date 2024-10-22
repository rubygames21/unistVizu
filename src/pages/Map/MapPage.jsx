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
      .attr('class', 'tooltip');

    // Charger le fichier GeoJSON
    d3.json('/wa_counties.json')
      .then((data) => {
        const projection = d3.geoMercator().fitSize([width, height], data);
        const path = d3.geoPath().projection(projection);

        // Ajouter les chemins de chaque comté
        svg.selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('d', path)
          .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', '#16a085'); // Vert au survol
            tooltip
              .text(d.properties.JURISDICT_NM)
              .style('visibility', 'visible')
              .attr('class', 'tooltip visible'); // Rendre le tooltip visible
          })
          .on('mousemove', function (event) {
            tooltip
              .style('top', `${event.pageY - 30}px`)
              .style('left', `${event.pageX + 10}px`);
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill', '#d1e8e2'); // Retour couleur initiale
            tooltip.attr('class', 'tooltip'); // Masquer le tooltip
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
