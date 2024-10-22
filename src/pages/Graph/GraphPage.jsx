import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './Graph.css';

function GraphPage() {
  useEffect(() => {
    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };

    // Supprimer tout contenu précédent
    d3.select('#graph').selectAll('*').remove();

    // Créer le conteneur SVG
    const svg = d3.select('#graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Charger les données JSON
    d3.json('/ev_sales.json')
      .then((data) => {
        // Définir les échelles
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([0, width]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.sales)])
          .range([height, 0]);

        // Ajouter les axes
        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).tickFormat(d3.format('d'))); // Format des années

        svg.append('g')
          .call(d3.axisLeft(y));

        // Fonction de ligne pour les ventes
        const line = d3.line()
          .x(d => x(d.year))
          .y(d => y(d.sales));

        // Ajouter la ligne de vente
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#1f77b4')
          .attr('stroke-width', 2)
          .attr('d', line);

        // Ajouter des zones colorées pour les administrations
        const administrations = ["Obama", "Trump", "Biden"];
        const colors = { "Obama": "#98df8a", "Trump": "#ff9896", "Biden": "#aec7e8" };

        administrations.forEach((admin, i) => {
          const adminData = data.filter(d => d.administration === admin);
          const xStart = x(adminData[0].year);
          const xEnd = x(adminData[adminData.length - 1].year);

          svg.append('rect')
            .attr('x', xStart)
            .attr('width', xEnd - xStart)
            .attr('y', 0)
            .attr('height', height)
            .attr('fill', colors[admin])
            .attr('opacity', 0.2);
        });

        // Ajouter des annotations
        data.forEach(d => {
          svg.append('circle')
            .attr('cx', x(d.year))
            .attr('cy', y(d.sales))
            .attr('r', 4)
            .attr('fill', '#ff7f0e');

          svg.append('text')
            .attr('x', x(d.year))
            .attr('y', y(d.sales) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(d.sales);
        });
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données :', error);
      });
  }, []);

  return (
    <section className="graph-page">
      <h2>Impact of Policies on EV Sales</h2>
      <div id="graph" className="chart-container"></div>
    </section>
  );
}

export default GraphPage;
