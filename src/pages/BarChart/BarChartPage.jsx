import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

function BarChartPage() {
  useEffect(() => {
    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };

    // Supprimer tout contenu précédent
    d3.select('#bar-chart').selectAll('*').remove();

    // Créer le conteneur SVG
    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Charger les données JSON
    d3.json('/co2_emissions.json')
      .then((data) => {
        // Définir les échelles
        const x = d3.scaleBand()
          .domain(data.map(d => d.type))
          .range([0, width])
          .padding(0.4);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.emissions)])
          .range([height, 0]);

        // Ajouter les axes
        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        svg.append('g')
          .call(d3.axisLeft(y));

        // Ajouter les barres
        svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', d => x(d.type))
          .attr('y', d => y(d.emissions))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.emissions))
          .attr('fill', '#69b3a2')
          .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', '#ffa500'); // Changer de couleur au hover
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill', '#69b3a2'); // Retour à la couleur initiale
          });
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données :', error);
      });
  }, []);

  return (
    <section className="bar-chart-page">
      <h2>CO2 Emissions: EV vs. ICE Vehicles</h2>
      <div id="bar-chart" className="chart-container"></div>
    </section>
  );
}

export default BarChartPage;
