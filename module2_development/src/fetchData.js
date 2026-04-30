import fs from 'fs';

async function fetchAndFormatData() {
  const response = await fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-languages.json');
  let data = await response.json();
  
  // Format the data
  let countries = data.map(item => {
    let langs = item.languages || [];
    
    // If it's India, apply specific sorting
    if (item.country === 'India') {
      const priority = ['Kannada', 'English', 'Hindi'];
      const rest = langs.filter(l => !priority.includes(l)).sort();
      langs = [...priority, ...rest];
    } else {
      langs = langs.sort();
    }
    
    return {
      name: item.country,
      languages: langs
    };
  });

  // Sort countries alphabetically
  countries.sort((a, b) => a.name.localeCompare(b.name));
  
  // Pull India to the top
  const indiaIndex = countries.findIndex(c => c.name === 'India');
  if (indiaIndex > -1) {
    const india = countries.splice(indiaIndex, 1)[0];
    countries.unshift(india);
  }

  const jsContent = `export const countriesData = ${JSON.stringify(countries, null, 2)};\n`;
  fs.writeFileSync('./countriesData.js', jsContent);
  console.log('Successfully generated countriesData.js');
}

fetchAndFormatData().catch(console.error);
