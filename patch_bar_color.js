const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', 'utf8');

// Use Math.abs for maxTotal
content = content.replace(
  "const maxTotal = Math.max(...dataPoints) || 1;",
  "const maxTotal = Math.max(...dataPoints.map(Math.abs)) || 1;"
);

// Use Math.abs for percentage calculation
content = content.replace(
  "const percentage = Math.max((val / maxTotal) * 85, 2);",
  "const percentage = Math.max((Math.abs(val) / maxTotal) * 85, 2);"
);

// Replace the bar className to handle val < 0
content = content.replace(
  "className={`w-full rounded-t-xl transition-all duration-300 ${isMax ? 'bg-[#111]' : 'bg-white/40 group-hover:bg-white/80'}`}",
  "className={`w-full rounded-t-xl transition-all duration-300 ${val < 0 ? 'bg-red-500/80 group-hover:bg-red-500' : (isMax ? 'bg-[#111]' : 'bg-white/40 group-hover:bg-white/80')}`}"
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', content, 'utf8');
