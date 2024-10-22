import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './LineChart.css';

function LineChartPage() {
  useEffect(() => {
    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };

    // Supprimer tout contenu précédent
    d3.select('#line-chart').selectAll('*').remove();

    // Créer le conteneur SVG
    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Charger les données JSON
    d3.json('/ev_adoption_over_time.json')
      .then((data) => {
        // Définir les échelles
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([0, width]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => Math.max(d.BEV, d.PHEV))])
          .range([height, 0]);

        // Ajouter les axes
        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).tickFormat(d3.format('d'))); // Format des années

        svg.append('g')
          .call(d3.axisLeft(y));

        // Fonction de ligne pour BEV
        const lineBEV = d3.line()
          .x(d => x(d.year))
          .y(d => y(d.BEV));

        // Fonction de ligne pour PHEV
        const linePHEV = d3.line()
          .x(d => x(d.year))
          .y(d => y(d.PHEV));

        // Ajouter la ligne BEV
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#1f77b4')
          .attr('stroke-width', 2)
          .attr('d', lineBEV);

        // Ajouter la ligne PHEV
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#ff7f0e')
          .attr('stroke-width', 2)
          .attr('d', linePHEV);

        // Ajouter les légendes
        svg.append('text')
          .attr('x', width - 100)
          .attr('y', 20)
          .attr('fill', '#1f77b4')
          .text('BEV');

        svg.append('text')
          .attr('x', width - 100)
          .attr('y', 40)
          .attr('fill', '#ff7f0e')
          .text('PHEV');
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données :', error);
      });
  }, []);

  return (
    <section className="line-chart-page">
      <h2>EV Adoption Over Time</h2>
      <div id="line-chart" className="chart-container"></div>
    </section>
  );
}

export default LineChartPage;
