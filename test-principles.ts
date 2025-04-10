// Test script for Google Sheets integration
import { getPrinciples } from './lib/principles';
import { PrinciplesData } from './lib/types';

async function testGoogleSheetsIntegration(): Promise<void> {
    console.log('Testing Google Sheets integration...');

    try {
        // Call the getPrinciples function
        const principles = await getPrinciples();

        // Log the results
        console.log('Successfully fetched principles data:');
        console.log(JSON.stringify(principles, null, 2));

        // Check if we have data for each dimension
        const dimensions = Object.keys(principles);
        console.log(`Found ${dimensions.length} dimensions: ${dimensions.join(', ')}`);

        // Check if each dimension has the expected data
        for (const dimension of dimensions) {
            const data = principles[dimension];
            console.log(`\nChecking dimension: ${dimension}`);
            console.log(`- Research items: ${data.research.length}`);
            console.log(`- Resources items: ${data.resources.length}`);
            console.log(`- Scripture items: ${data.Scripture.length}`);
            console.log(`- Statements items: ${data.statements.length}`);

            // Check the structure of dimensions data
            if (data.why) {
                console.log('\nSample dimension data structure:');
                console.log(`- why: ${data.why.substring(0, 50)}...`);
                console.log(`- description: ${data.description.substring(0, 50)}...`);
                console.log(`- welcome: ${data.welcome}`);
                console.log(`- levels: ${data.levels.length} levels`);
                console.log('  Levels:');
                data.levels.forEach((level, index) => {
                    console.log(`  - Level ${index}: ${level.substring(0, 50)}...`);
                });
            }
        }

        console.log('\nTest completed successfully!');
    } catch (error) {
        console.error('Error testing Google Sheets integration:', error);
    }
}

// Run the test
testGoogleSheetsIntegration(); 