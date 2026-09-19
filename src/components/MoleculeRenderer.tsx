import React, { useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RotateCcw, Copy, Check } from 'lucide-react';
import { MolecularCandidate } from '../types';

interface MoleculeRendererProps {
  candidate: MolecularCandidate;
  width?: number;
  height?: number;
  interactive?: boolean;
  compact?: boolean;
}

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({
  candidate,
  width = 320,
  height = 200,
  interactive = true,
  compact = false
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopySmiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(candidate.smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation(prev => (prev + 45) % 360);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation(0);
    setScale(1);
  };

  // Atom coloring palette (CPK coloring standard)
  const getAtomColor = (symbol: string) => {
    switch (symbol) {
      case 'N':
        return '#38bdf8'; // Blue
      case 'O':
        return '#f43f5e'; // Red/Pink
      case 'S':
        return '#fbbf24'; // Yellow
      case 'F':
        return '#2dd4bf'; // Teal
      case 'Cl':
        return '#4ade80'; // Light Green
      case 'P':
        return '#fb923c'; // Orange
      case 'C':
      default:
        return '#94a3b8'; // Slate
    }
  };

  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div className={`relative bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col items-center justify-center ${compact ? 'p-1' : 'p-3'}`}>
      {/* Molecule Header bar */}
      {!compact && (
        <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-slate-800/60 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-cyan-400 font-semibold">{candidate.formula}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">MW {candidate.molecularWeight.toFixed(1)}</span>
          </div>
          <button
            onClick={handleCopySmiles}
            title="Copy SMILES string"
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px]">SMILES</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden flex items-center justify-center select-none" style={{ height }}>
        {/* Background coordinate grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern id={`grid-${candidate.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${candidate.id})`} />
        </svg>

        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="transition-transform duration-300 ease-out"
        >
          <g
            transform={`translate(${centerX}, ${centerY}) rotate(${rotation}) scale(${scale}) translate(-${centerX}, -${centerY})`}
          >
            {/* Render Bonds */}
            {candidate.bonds.map((bond, idx) => {
              const a1 = candidate.atoms[bond.source];
              const a2 = candidate.atoms[bond.target];
              if (!a1 || !a2) return null;

              // Scale coordinate fitting
              const x1 = (a1.x / 400) * (width - 40) + 20;
              const y1 = (a1.y / 160) * (height - 40) + 20;
              const x2 = (a2.x / 400) * (width - 40) + 20;
              const y2 = (a2.y / 160) * (height - 40) + 20;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              if (length === 0) return null;

              // Normal perpendicular vector for double bonds
              const nx = -dy / length;
              const ny = dx / length;
              const offset = 2.4;

              if (bond.order === 2) {
                return (
                  <g key={`bond-${idx}`}>
                    <line
                      x1={x1 + nx * offset}
                      y1={y1 + ny * offset}
                      x2={x2 + nx * offset}
                      y2={y2 + ny * offset}
                      stroke="#64748b"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={x1 - nx * offset}
                      y1={y1 - ny * offset}
                      x2={x2 - nx * offset}
                      y2={y2 - ny * offset}
                      stroke="#64748b"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </g>
                );
              }

              return (
                <line
                  key={`bond-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Render Atoms */}
            {candidate.atoms.map((atom) => {
              const cx = (atom.x / 400) * (width - 40) + 20;
              const cy = (atom.y / 160) * (height - 40) + 20;
              const isCarbon = atom.symbol === 'C';
              const color = getAtomColor(atom.symbol);

              return (
                <g key={`atom-${atom.id}`}>
                  {/* Outer glow for heteroatoms */}
                  {!isCarbon && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="11"
                      fill={color}
                      fillOpacity="0.15"
                    />
                  )}

                  {/* Atom circle background */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isCarbon ? 3.5 : 8}
                    fill="#0f172a"
                    stroke={color}
                    strokeWidth={isCarbon ? 1.5 : 2}
                  />

                  {/* Atom label for non-carbon */}
                  {!isCarbon && (
                    <text
                      x={cx}
                      y={cy + 3.5}
                      textAnchor="middle"
                      fill={color}
                      fontSize="9px"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {atom.symbol}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating controls */}
        {interactive && (
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg">
            <button
              onClick={handleRotate}
              title="Rotate 45°"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SMILES code preview */}
      {!compact && (
        <div className="w-full mt-2 pt-2 border-t border-slate-800/60">
          <div className="font-mono text-[10px] text-slate-400 truncate bg-slate-900/90 px-2 py-1 rounded border border-slate-800 select-all">
            {candidate.smiles}
          </div>
        </div>
      )}
    </div>
  );
};
