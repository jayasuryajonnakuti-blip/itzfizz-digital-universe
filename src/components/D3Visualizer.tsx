import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { signalAudio } from '../lib/audioSignal';

export default function D3Visualizer() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = 200;
    const barWidth = 4;
    const barPadding = 2;
    const numBars = Math.floor(width / (barWidth + barPadding));

    // Initial bars
    const data = new Array(numBars).fill(0);
    
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (barWidth + barPadding))
      .attr('y', height)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', '#d7ff00')
      .attr('opacity', 0.2);

    let animationId: number;

    const update = () => {
      if (signalAudio.analyser) {
        const bufferLength = signalAudio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        signalAudio.analyser.getByteFrequencyData(dataArray);

        // Smoothly interpolate data to match numBars
        const barsData = [];
        const step = Math.floor(bufferLength / numBars);
        for (let i = 0; i < numBars; i++) {
          barsData.push(dataArray[i * step] || 0);
        }

        svg
          .selectAll('rect')
          .data(barsData)
          .attr('y', (d) => height - (d / 255) * height)
          .attr('height', (d) => (d / 255) * height)
          .attr('opacity', (d) => 0.1 + (d / 255) * 0.4);
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      svg.attr('width', newWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-[1]">
      <svg 
        ref={svgRef} 
        width="100%" 
        height="200" 
        className="opacity-40"
      />
    </div>
  );
}
