const fs = require('fs');
let content = fs.readFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', 'utf8');

// Change from 100 to 85 max height percentage
content = content.replace(
  "const percentage = Math.max((val / maxTotal) * 100, 2);",
  "const percentage = Math.max((val / maxTotal) * 85, 2);"
);

// We can place the label directly on top of the bar using bottom={percentage}
// Wait, the label is absolutely positioned inside the flex container.
// The container is h-full, and the bar has height: displayPercentage.
// If we put the label at `bottom: ${displayPercentage}%`, it sits perfectly on top of the bar!
content = content.replace(
  `{/* Permanent Label above bar */}
                <div className="absolute -top-6 text-[#111] text-[9px] sm:text-[10px] font-bold py-1 px-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md">
                  {formatCompact(val)}
                </div>`,
  `{/* Permanent Label above bar */}
                <div 
                  className="absolute text-[#111] text-[9px] sm:text-[10px] font-bold pb-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md transition-all duration-300"
                  style={{ bottom: \`\${displayPercentage}%\` }}
                >
                  {formatCompact(val)}
                </div>`
);

fs.writeFileSync('/home/shaktimaan/Documents/mrrs_billing/src/components/DashboardBarChart.tsx', content, 'utf8');
