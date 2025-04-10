// Function to convert JSON data to CSV format
function convertToCSV(jsonData) {
  // CSV header
  let csvContent = "dimension,statement,action\n";

  // Process each dimension in the JSON
  for (const dimension in jsonData) {
    // Process each item in the dimension
    jsonData[dimension].forEach((item) => {
      // Escape quotes and commas in statement and action
      const escapedStatement = item.statement.replace(/"/g, '""');
      const escapedAction = item.action.replace(/"/g, '""');

      // Add the row to CSV content
      // Wrap statement and action in quotes to handle commas within them
      csvContent += `${dimension},"${escapedStatement}","${escapedAction}"\n`;
    });
  }

  return csvContent;
}

// Example usage:
// const a = {...}; // Your JSON data
// const csv = convertToCSV(a);
// console.log(csv);

// To save to a file (in Node.js environment):
// const fs = require('fs');
// fs.writeFileSync('output.csv', csv);

module.exports = convertToCSV;
