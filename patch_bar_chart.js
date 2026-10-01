const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', 'utf8');

const formatFn = `  const formatCompact = (val: number) => {
    if (val === 0) return '';
    return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(val);
  };
`;

content = content.replace(
  "  const maxTotal = Math.max(...dataPoints) || 1; // avoid division by 0",
  formatFn + "\n  const maxTotal = Math.max(...dataPoints) || 1; // avoid division by 0"
);

// Replace the tooltip with permanently visible compact text
content = content.replace(
  `{/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#111] text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  ₹{val.toLocaleString()}
                </div>`,
  `{/* Permanent Label above bar */}
                <div className="absolute -top-6 text-[#111] text-[9px] sm:text-[10px] font-bold py-1 px-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md">
                  {formatCompact(val)}
                </div>`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', content, 'utf8');
